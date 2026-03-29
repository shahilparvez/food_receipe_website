import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import Toast from '../components/Toast'

export default function AddRecipe() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [form, setForm] = useState({
    name: '', ingredients: '', description: '',
    famous_restaurant: '', avg_price: '',
    zomato_link: '', swiggy_link: '',
    blinkit_link: '', zepto_link: '', instamart_link: '',
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    let image_url = null
    let image_path = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(path, imageFile)

      if (uploadError) {
        setToast({ message: 'Image upload failed', type: 'error' })
        setLoading(false)
        return
      }

      image_path = path
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(path)
      image_url = publicUrl
    }

    const { error } = await supabase.from('recipes').insert({
      ...form,
      image_url,
      image_path,
    })

    if (error) {
      setToast({ message: 'Failed to add recipe', type: 'error' })
    } else {
      setToast({ message: 'Recipe added successfully!', type: 'success' })
      setTimeout(() => navigate('/admin'), 1200)
    }
    setLoading(false)
  }

  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={styles.container}>
        <button onClick={() => navigate('/admin')} style={styles.back}>← Back</button>
        <h1 style={styles.title}>➕ Add Recipe</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Basic Info</h2>
            <div style={styles.field}>
              <label style={styles.label}>Recipe Name *</label>
              <input placeholder="e.g. Chicken Biryani" value={form.name} onChange={set('name')} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Ingredients *</label>
              <textarea placeholder="List all ingredients..." value={form.ingredients} onChange={set('ingredients')} required style={{ minHeight: 120 }} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Procedure / Description *</label>
              <textarea placeholder="Step-by-step cooking instructions..." value={form.description} onChange={set('description')} required style={{ minHeight: 160 }} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Recipe Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                style={{ ...styles.fileInput }}
              />
              {imageFile && <p style={styles.hint}>Selected: {imageFile.name}</p>}
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🍽 Order to Eat</h2>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <label style={styles.label}>Famous Restaurant</label>
                <input placeholder="e.g. Buhari" value={form.famous_restaurant} onChange={set('famous_restaurant')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Average Price</label>
                <input placeholder="e.g. ₹250 - ₹350" value={form.avg_price} onChange={set('avg_price')} />
              </div>
            </div>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <label style={styles.label}>Zomato Link</label>
                <input type="url" placeholder="https://zomato.com/..." value={form.zomato_link} onChange={set('zomato_link')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Swiggy Link</label>
                <input type="url" placeholder="https://swiggy.com/..." value={form.swiggy_link} onChange={set('swiggy_link')} />
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🛒 Order to Cook</h2>
            <div style={styles.grid3}>
              <div style={styles.field}>
                <label style={styles.label}>Blinkit Link</label>
                <input type="url" placeholder="https://blinkit.com/..." value={form.blinkit_link} onChange={set('blinkit_link')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Zepto Link</label>
                <input type="url" placeholder="https://zepto.com/..." value={form.zepto_link} onChange={set('zepto_link')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Instamart Link</label>
                <input type="url" placeholder="https://swiggy.com/instamart/..." value={form.instamart_link} onChange={set('instamart_link')} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Adding Recipe...' : '✅ Add Recipe'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' },
  back: {
    background: 'transparent', color: '#888', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14,
    marginBottom: 24, fontFamily: "'DM Sans', sans-serif",
  },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, marginBottom: 32 },
  form: { display: 'flex', flexDirection: 'column', gap: 24 },
  card: { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14, padding: 28 },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#e85d04', marginBottom: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 },
  label: { fontSize: 13, color: '#888', fontWeight: 500 },
  hint: { fontSize: 12, color: '#52b788', marginTop: 4 },
  fileInput: { background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#888', borderRadius: 10, padding: '10px 16px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  submitBtn: { padding: '16px', fontSize: 16, width: '100%' },
}
