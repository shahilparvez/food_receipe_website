import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import RecipeCard from '../components/RecipeCard'
import Particles from '../components/Particles'

export default function UserHome() {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return
    setLoading(true)
    setSearched(true)

    // Handle biryani/biriyani alternate spelling like original
    let alt = search
    if (search.toLowerCase() === 'biryani') alt = 'biriyani'
    if (search.toLowerCase() === 'biriyani') alt = 'biryani'

    const { data } = await supabase
      .from('recipes')
      .select('*')
      .or(`name.ilike.%${search}%,name.ilike.%${alt}%`)

    setRecipes(data || [])
    setLoading(false)
  }

  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover <span style={{ color: '#e85d04' }}>Delicious</span> Recipes</h1>
        <p style={styles.heroSub}>Search from our collection and find your next favourite dish</p>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search recipes... (e.g. Biryani, Dosa, Pasta)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" className="btn-primary" style={styles.searchBtn}>Search 🔍</button>
        </form>
      </div>

      <div style={styles.content}>
        {loading && <div className="spinner" />}

        {!loading && searched && recipes.length === 0 && (
          <div className="empty-state">
            <h3>❌ Sorry, that recipe is unavailable</h3>
            <p>Try searching for something else</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="empty-state">
            <h3>👨‍🍳 What are you craving?</h3>
            <p>Search for any recipe above to get started</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <>
            <p style={styles.resultCount}>{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found for "<strong>{search}</strong>"</p>
            <div className="recipe-grid">
              {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  hero: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '80px 24px 48px',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: 900,
    marginBottom: 12,
    lineHeight: 1.1,
  },
  heroSub: { color: '#888', fontSize: 17, marginBottom: 36 },
  searchForm: {
    display: 'flex',
    gap: 12,
    maxWidth: 600,
    margin: '0 auto',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    minWidth: 200,
    fontSize: 16,
    padding: '14px 20px',
    borderRadius: 50,
  },
  searchBtn: {
    borderRadius: 50,
    padding: '14px 28px',
    whiteSpace: 'nowrap',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px 60px',
  },
  resultCount: { color: '#888', fontSize: 14, marginBottom: 24 },
}
