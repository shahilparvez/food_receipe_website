import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import Toast from '../components/Toast'

export default function ImportRecipe() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const [links, setLinks] = useState({
    famous_restaurant: '', avg_price: '',
    zomato_link: '', swiggy_link: '',
    blinkit_link: '', zepto_link: '', instamart_link: '',
  })

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setSelected(null)
    setResults([])

    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.meals || [])
    } catch {
      setToast({ message: 'Failed to fetch from TheMealDB', type: 'error' })
    }
    setSearching(false)
  }

  function selectMeal(meal) {
    // Parse ingredients from TheMealDB format (strIngredient1...strIngredient20)
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`]
      const measure = meal[`strMeasure${i}`]
      if (ing && ing.trim()) {
        ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ing.trim()}`)
      }
    }

    setSelected({
      name: meal.strMeal,
      ingredients: ingredients.join('\n'),
      description: meal.strInstructions,
      image_url: meal.strMealThumb,
      image_path: null,
    })

    setLinks({
      famous_restaurant: '', avg_price: '',
      zomato_link: '', swiggy_link: '',
      blinkit_link: '', zepto_link: '', instamart_link: '',
    })

    // Scroll to form
    setTimeout(() => {
      document.getElementById('import-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const setLink = (k) => (e) => setLinks(l => ({ ...l, [k]: e.target.value }))

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase.from('recipes').insert({
      ...selected,
      ...links,
    })

    if (error) {
      setToast({ message: 'Failed to save recipe', type: 'error' })
    } else {
      setToast({ message: `"${selected.name}" imported successfully!`, type: 'success' })
      setTimeout(() => navigate('/admin'), 1200)
    }
    setSaving(false)
  }

  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={styles.container}>
        <button onClick={() => navigate('/admin')} style={styles.back}>← Back</button>
        <h1 style={styles.title}>🌐 Import from TheMealDB</h1>
        <p style={styles.sub}>Search any recipe and import it directly into your database</p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search a recipe... (e.g. Biryani, Chicken, Pasta)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" className="btn-primary" style={styles.searchBtn} disabled={searching}>
            {searching ? 'Searching...' : '🔍 Search'}
          </button>
        </form>

        {/* Results Grid */}
        {results.length > 0 && (
          <div style={styles.section}>
            <p style={styles.resultCount}>{results.length} result{results.length !== 1 ? 's' : ''} found</p>
            <div style={styles.resultsGrid}>
              {results.map(meal => (
                <div
                  key={meal.idMeal}
                  style={{
                    ...styles.resultCard,
                    ...(selected?.name === meal.strMeal ? styles.resultCardSelected : {})
                  }}
                  onClick={() => selectMeal(meal)}
                >
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={styles.resultImg}
                  />
                  <div style={styles.resultBody}>
                    <h3 style={styles.resultName}>{meal.strMeal}</h3>
                    <p style={styles.resultMeta}>{meal.strCategory} · {meal.strArea}</p>
                    <button
                      className="btn-primary"
                      style={{ fontSize: 13, padding: '8px 16px', marginTop: 8 }}
                      onClick={(e) => { e.stopPropagation(); selectMeal(meal) }}
                    >
                      Select →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searching && results.length === 0 && query && (
          <div className="empty-state">
            <h3>No recipes found</h3>
            <p>Try a different search term</p>
          </div>
        )}

        {/* Import Form */}
        {selected && (
          <div id="import-form" style={styles.importSection}>
            <h2 style={styles.importTitle}>📋 Review & Import</h2>

            {/* Preview */}
            <div style={styles.previewCard}>
              <img src={selected.image_url} alt={selected.name} style={styles.previewImg} />
              <div style={styles.previewBody}>
                <h3 style={styles.previewName}>{selected.name}</h3>

                <div style={styles.previewField}>
                  <span style={styles.previewLabel}>Ingredients</span>
                  <p style={styles.previewText}>{selected.ingredients}</p>
                </div>

                <div style={styles.previewField}>
                  <span style={styles.previewLabel}>Procedure</span>
                  <p style={styles.previewText}>{selected.description?.slice(0, 300)}...</p>
                </div>
              </div>
            </div>

            {/* Delivery Links Form */}
            <form onSubmit={handleSave} style={styles.linksForm}>
              <p style={styles.linksNote}>
                ✏️ Optionally add delivery links before saving
              </p>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🍽 Order to Eat</h3>
                <div style={styles.grid2}>
                  <div style={styles.field}>
                    <label style={styles.label}>Famous Restaurant</label>
                    <input placeholder="e.g. Buhari" value={links.famous_restaurant} onChange={setLink('famous_restaurant')} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Average Price</label>
                    <input placeholder="e.g. ₹250 - ₹350" value={links.avg_price} onChange={setLink('avg_price')} />
                  </div>
                </div>
                <div style={styles.grid2}>
                  <div style={styles.field}>
                    <label style={styles.label}>Zomato Link</label>
                    <input type="url" placeholder="https://zomato.com/..." value={links.zomato_link} onChange={setLink('zomato_link')} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Swiggy Link</label>
                    <input type="url" placeholder="https://swiggy.com/..." value={links.swiggy_link} onChange={setLink('swiggy_link')} />
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🛒 Order to Cook</h3>
                <div style={styles.grid3}>
                  <div style={styles.field}>
                    <label style={styles.label}>Blinkit Link</label>
                    <input type="url" placeholder="https://blinkit.com/..." value={links.blinkit_link} onChange={setLink('blinkit_link')} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Zepto Link</label>
                    <input type="url" placeholder="https://zepto.com/..." value={links.zepto_link} onChange={setLink('zepto_link')} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Instamart Link</label>
                    <input type="url" placeholder="https://swiggy.com/instamart/..." value={links.instamart_link} onChange={setLink('instamart_link')} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : `✅ Import "${selected.name}" to Database`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '32px 24px 80px' },
  back: {
    background: 'transparent', color: '#888', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14,
    marginBottom: 24, fontFamily: "'DM Sans', sans-serif",
  },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, marginBottom: 8 },
  sub: { color: '#888', fontSize: 15, marginBottom: 32 },
  searchForm: { display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: 200, fontSize: 16, padding: '14px 20px', borderRadius: 50 },
  searchBtn: { borderRadius: 50, padding: '14px 28px', whiteSpace: 'nowrap' },
  section: { marginBottom: 40 },
  resultCount: { color: '#888', fontSize: 13, marginBottom: 16 },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
  },
  resultCard: {
    background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14,
    overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s',
  },
  resultCardSelected: { borderColor: '#e85d04', transform: 'scale(1.01)' },
  resultImg: { width: '100%', height: 160, objectFit: 'cover', display: 'block' },
  resultBody: { padding: '14px 16px' },
  resultName: { fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 4 },
  resultMeta: { color: '#888', fontSize: 12, marginBottom: 4 },
  importSection: { marginTop: 48 },
  importTitle: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: '#e85d04', marginBottom: 20 },
  previewCard: {
    background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14,
    overflow: 'hidden', display: 'flex', gap: 0, marginBottom: 28,
    flexWrap: 'wrap',
  },
  previewImg: { width: 240, height: 200, objectFit: 'cover', flexShrink: 0 },
  previewBody: { padding: '20px 24px', flex: 1 },
  previewName: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, marginBottom: 16 },
  previewField: { marginBottom: 12 },
  previewLabel: { fontSize: 11, color: '#e85d04', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 },
  previewText: { color: '#aaa', fontSize: 13, lineHeight: 1.6 },
  linksForm: { display: 'flex', flexDirection: 'column', gap: 20 },
  linksNote: { color: '#888', fontSize: 14, padding: '12px 16px', background: '#1f1f1f', borderRadius: 8, border: '1px solid #2a2a2a' },
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24 },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#e85d04', marginBottom: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 },
  label: { fontSize: 13, color: '#888', fontWeight: 500 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  saveBtn: { padding: '16px', fontSize: 16, width: '100%' },
}
