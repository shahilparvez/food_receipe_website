import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RecipeCard({ recipe, onDelete, onEdit }) {
  const { isAdmin } = useAuth()
  const imageUrl = recipe.image_url || `https://placehold.co/400x250/1f1f1f/888?text=${encodeURIComponent(recipe.name)}`

  return (
    <div style={styles.card}>
      <Link to={isAdmin ? `/admin/edit/${recipe.id}` : `/recipe/${recipe.id}`}>
        <div style={styles.imgWrap}>
          <img
            src={imageUrl}
            alt={recipe.name}
            style={styles.img}
            onError={e => { e.target.src = `https://placehold.co/400x250/1f1f1f/888?text=🍽` }}
          />
          <div style={styles.imgOverlay} />
        </div>
      </Link>

      <div style={styles.body}>
        <Link to={isAdmin ? `/admin/edit/${recipe.id}` : `/recipe/${recipe.id}`} style={{ display: 'block' }}>
          <h3 style={styles.title}>{recipe.name}</h3>
        </Link>
        <p style={styles.ingredients}>{recipe.ingredients?.slice(0, 80)}{recipe.ingredients?.length > 80 ? '...' : ''}</p>

        {isAdmin && (
          <div style={styles.actions}>
            <Link to={`/admin/edit/${recipe.id}`}>
              <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }}>Edit</button>
            </Link>
            <button className="btn-danger" onClick={() => onDelete && onDelete(recipe.id)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#161616',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid #2a2a2a',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imgWrap: { position: 'relative', height: 200, overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', display: 'block' },
  imgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(22,22,22,0.8) 0%, transparent 60%)',
  },
  body: { padding: '16px' },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 6,
    color: '#f0ece4',
  },
  ingredients: { fontSize: 13, color: '#888', lineHeight: 1.5, marginBottom: 12 },
  actions: { display: 'flex', gap: 8, marginTop: 12 },
}
