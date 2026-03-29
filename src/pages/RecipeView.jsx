import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import Toast from '../components/Toast'

export default function RecipeView() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    const [{ data: recipe }, { data: fav }] = await Promise.all([
      supabase.from('recipes').select('*').eq('id', id).single(),
      supabase.from('favourites').select('id').eq('user_id', user.id).eq('recipe_id', id).single()
    ])
    setRecipe(recipe)
    setIsFav(!!fav)
    setLoading(false)
  }

  async function toggleFavourite() {
    if (isFav) {
      await supabase.from('favourites').delete().eq('user_id', user.id).eq('recipe_id', id)
      setIsFav(false)
      setToast({ message: 'Removed from favourites', type: 'error' })
    } else {
      await supabase.from('favourites').insert({ user_id: user.id, recipe_id: id })
      setIsFav(true)
      setToast({ message: 'Added to favourites!', type: 'success' })
    }
  }

  if (loading) return <><Navbar /><div className="spinner" /></>
  if (!recipe) return <><Navbar /><div className="empty-state"><h3>Recipe not found</h3></div></>

  const imageUrl = recipe.image_url || `https://placehold.co/800x400/1f1f1f/888?text=${encodeURIComponent(recipe.name)}`

  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>

        <div style={styles.hero}>
          <img
            src={imageUrl}
            alt={recipe.name}
            style={styles.img}
            onError={e => { e.target.src = 'https://placehold.co/800x400/1f1f1f/888?text=🍽' }}
          />
          <div style={styles.imgOverlay} />

          <div style={styles.heroContent}>
            <h1 style={styles.title}>{recipe.name}</h1>
            <button
              onClick={toggleFavourite}
              style={{ ...styles.heartBtn, color: isFav ? '#e63946' : '#888' }}
              title={isFav ? 'Remove from favourites' : 'Add to favourites'}
            >
              {isFav ? '❤️' : '🤍'} {isFav ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div style={styles.body}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🧂 Ingredients</h2>
            <p style={styles.text}>{recipe.ingredients}</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>👨‍🍳 Procedure</h2>
            <p style={styles.text}>{recipe.description}</p>
          </section>

          {/* Order to Eat */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🍽 Order to Eat</h2>
            {recipe.famous_restaurant && (
              <p style={styles.meta}><b>Famous Restaurant:</b> {recipe.famous_restaurant}</p>
            )}
            {recipe.avg_price && (
              <p style={styles.meta}><b>Average Price:</b> {recipe.avg_price}</p>
            )}
            <div style={styles.btnRow}>
              {recipe.zomato_link && (
                <a href={recipe.zomato_link} target="_blank" rel="noreferrer">
                  <button style={{ ...styles.orderBtn, background: '#e23744' }}>🔴 Zomato</button>
                </a>
              )}
              {recipe.swiggy_link && (
                <a href={recipe.swiggy_link} target="_blank" rel="noreferrer">
                  <button style={{ ...styles.orderBtn, background: '#fc8019' }}>🟠 Swiggy</button>
                </a>
              )}
            </div>
          </section>

          {/* Order to Cook */}
          {(recipe.blinkit_link || recipe.zepto_link || recipe.instamart_link) && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🛒 Order to Cook</h2>
              <div style={styles.btnRow}>
                {recipe.blinkit_link && (
                  <a href={recipe.blinkit_link} target="_blank" rel="noreferrer">
                    <button style={{ ...styles.orderBtn, background: '#f8c200', color: '#000' }}>⚡ Blinkit</button>
                  </a>
                )}
                {recipe.zepto_link && (
                  <a href={recipe.zepto_link} target="_blank" rel="noreferrer">
                    <button style={{ ...styles.orderBtn, background: '#8b2fc9' }}>🟣 Zepto</button>
                  </a>
                )}
                {recipe.instamart_link && (
                  <a href={recipe.instamart_link} target="_blank" rel="noreferrer">
                    <button style={{ ...styles.orderBtn, background: '#0db35b' }}>🟢 Instamart</button>
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '24px 24px 60px' },
  back: {
    background: 'transparent',
    color: '#888',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 14,
    marginBottom: 24,
    fontFamily: "'DM Sans', sans-serif",
  },
  hero: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    height: 360,
  },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.2) 60%, transparent 100%)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24, left: 24, right: 24,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(24px, 4vw, 36px)',
    fontWeight: 900,
    color: '#f0ece4',
    lineHeight: 1.2,
  },
  heartBtn: {
    background: 'rgba(22,22,22,0.8)',
    border: '1px solid #2a2a2a',
    borderRadius: 50,
    padding: '10px 18px',
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    whiteSpace: 'nowrap',
    backdropFilter: 'blur(8px)',
  },
  body: { display: 'flex', flexDirection: 'column', gap: 32 },
  section: {
    background: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: 14,
    padding: '24px',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
    color: '#e85d04',
  },
  text: { color: '#ccc', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-line' },
  meta: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  btnRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 },
  orderBtn: {
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
}
