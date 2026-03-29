import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import Toast from '../components/Toast'

export default function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [form, setForm] = useState({
    name: '', ingredients: '', description: '',
    famous_restaurant: '', avg_price: '',
    zomato_link: '', swiggy_link: '',
    blinkit_link: '', zepto_link: '', instamart_link: '',
  })
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const [existingImagePath, setExistingImagePath] = useState(null)

  useEffect(() => { fetchRecipe() }, [id])

  async function fetchRecipe() {
    const { data } = await supabase.from('recipes').select('*').eq('id', id).single()
    if (data) {
      const { image_url, image_path, ...rest } = data
      setForm({
        name: rest.name || '',
        ingredients: rest.ingredients || '',
        description: rest.description || '',
        famous_restaurant: rest.famous_restaurant || '',
        avg_price: rest.avg_price || '',
        zomato_link: rest.zomato_link || '',
        swiggy_link: rest.swiggy_link || '',
        blinkit_link: rest.blinkit_link || '',
        zepto_link: rest.zepto_link || '',
        instamart_link: rest.instamart_link || '',
      })
      setExistingImageUrl(image_url)
      setExistingImagePath(image_path)
    }
    setLoading(false)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    let image_url = existingImageUrl
    let image_path = existingImagePath

    if (imageFile) {
      // Delete old image if exists
      if (existingImagePath) {
        await supabase.storage.from('recipe-images').remove([existingImagePath])
      }

      const ext = imageFile.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(path, imageFile)

      if (uploadError) {
        setToast({ message: 'Image upload failed', type: 'error' })
        setSaving(false)
        return
      }

      image_path = path
      const { data: { publicUrl } } = supabase.storage.from('recipe-images').getPublicUrl(path)
      image_url = publicUrl
    }

    const { error } = await supabase.from('recipes').update({
      ...form,
      image_url,
      image_path,
    }).eq('id', id)

    if (error) {
      setToast({ message: 'Failed to update recipe', type: 'error' })
    } else {
      setToast({ message: 'Recipe updated!', type: 'success' })
      setTimeout(() => navigate('/admin'), 1200)
    }
    setSaving(false)
  }

  if (loading) return <><Navbar /><div className="spinner" /></>

  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={styles.container}>
        <button onClick={() => navigate('/admin')} style={styles.back}>← Back</button>
        <h1 style={styles.title}>✏️ Edit Recipe</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Basic Info</h2>
            <div style={styles.field}>
              <label style={styles.label}>Recipe Name *</label>
              <input value={form.name} onChange={set('name')} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Ingredients *</label>
              <textarea value={form.ingredients} onChange={set('ingredients')} required style={{ minHeight: 120 }} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Procedure / Description *</label>
              <textarea value={form.description} onChange={set('description')} required style={{ minHeight: 160 }} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Recipe Image</label>
              {existingImageUrl && (
                <div style={styles.imgPreviewWrap}>
                  <img src={existingImageUrl} alt="Current" style={styles.imgPreview} />
                  <p style={styles.hint}>Current image. Upload a new one to replace it.</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                style={styles.fileInput}
              />
              {imageFile && <p style={styles.hint}>New image: {imageFile.name}</p>}
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
                <input type="url" value={form.zomato_link} onChange={set('zomato_link')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Swiggy Link</label>
                <input type="url" value={form.swiggy_link} onChange={set('swiggy_link')} />
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🛒 Order to Cook</h2>
            <div style={styles.grid3}>
              <div style={styles.field}>
                <label style={styles.label}>Blinkit Link</label>
                <input type="url" value={form.blinkit_link} onChange={set('blinkit_link')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Zepto Link</label>
                <input type="url" value={form.zepto_link} onChange={set('zepto_link')} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Instamart Link</label>
                <input type="url" value={form.instamart_link} onChange={set('instamart_link')} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
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
  imgPreviewWrap: { marginBottom: 10 },
  imgPreview: { width: 160, height: 100, objectFit: 'cover', borderRadius: 8, display: 'block', marginBottom: 6 },
  fileInput: { background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#888', borderRadius: 10, padding: '10px 16px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  submitBtn: { padding: '16px', fontSize: 16, width: '100%' },
}
