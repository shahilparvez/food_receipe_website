import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import RecipeCard from '../components/RecipeCard'
import Particles from '../components/Particles'

export default function Favourites() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavourites()
  }, [])

  async function fetchFavourites() {
    const { data } = await supabase
      .from('favourites')
      .select('recipe_id, recipes(*)')
      .eq('user_id', user.id)

    setRecipes(data?.map(f => f.recipes).filter(Boolean) || [])
    setLoading(false)
  }

  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />

      <div style={styles.container}>
        <h1 style={styles.title}>❤️ My Favourites</h1>
        <p style={styles.sub}>Your saved recipes, all in one place</p>

        {loading && <div className="spinner" />}

        {!loading && recipes.length === 0 && (
          <div className="empty-state">
            <h3>No favourites yet</h3>
            <p>Go explore recipes and heart the ones you love!</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="recipe-grid">
            {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 1200,
    margin: '0 auto',
    padding: '48px 24px 60px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    fontWeight: 900,
    marginBottom: 8,
  },
  sub: { color: '#888', fontSize: 15, marginBottom: 40 },
}
