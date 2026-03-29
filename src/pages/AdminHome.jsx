import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import RecipeCard from '../components/RecipeCard'
import Particles from '../components/Particles'
import Toast from '../components/Toast'

export default function AdminHome() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchRecipes() }, [])

  async function fetchRecipes() {
    const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false })
    setRecipes(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this recipe?')) return
    const recipe = recipes.find(r => r.id === id)

    // Delete image from storage if it was uploaded
    if (recipe?.image_path) {
      await supabase.storage.from('recipe-images').remove([recipe.image_path])
    }

    await supabase.from('recipes').delete().eq('id', id)
    setRecipes(prev => prev.filter(r => r.id !== id))
    setToast({ message: 'Recipe deleted', type: 'error' })
  }

  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🛠 Admin Panel</h1>
            <p style={styles.sub}>{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} total</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/admin/import">
              <button className="btn-secondary" style={{ padding: '12px 24px' }}>🌐 Import from TheMealDB</button>
            </Link>
            <Link to="/admin/add">
              <button className="btn-primary" style={{ padding: '12px 24px' }}>➕ Add Manually</button>
            </Link>
          </div>
        </div>

        {loading && <div className="spinner" />}

        {!loading && recipes.length === 0 && (
          <div className="empty-state">
            <h3>No recipes yet</h3>
            <p>Add your first recipe to get started</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="recipe-grid">
            {recipes.map(r => (
              <RecipeCard key={r.id} recipe={r} onDelete={handleDelete} />
            ))}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    fontWeight: 900,
    marginBottom: 4,
  },
  sub: { color: '#888', fontSize: 14 },
}
