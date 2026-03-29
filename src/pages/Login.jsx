import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Particles from '../components/Particles'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Invalid email or password')
      setLoading(false)
    }
    // navigation handled by App.jsx auth redirect
  }

  return (
    <div style={styles.page}>
      <Particles />
      <div style={styles.card}>
        <div style={styles.emoji}>🍽</div>
        <h1 style={styles.title}>Food Recipes</h1>
        <p style={styles.subtitle}>Sign in to explore delicious recipes</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" className="btn-primary" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          New here?{' '}
          <Link to="/register" style={styles.link}>Create an account</Link>
        </p>
        <p style={styles.footer}>
          <Link to="/about" style={styles.link}>About</Link>
          {' · '}
          <Link to="/contact" style={styles.link}>Contact</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 20,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: 20,
    padding: '48px 40px',
    width: '100%',
    maxWidth: 420,
    textAlign: 'center',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 900,
    color: '#e85d04',
    marginBottom: 6,
  },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 32 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  input: { textAlign: 'left' },
  error: { color: '#e63946', fontSize: 14, textAlign: 'left' },
  btn: { width: '100%', padding: '14px', fontSize: 16, marginTop: 4 },
  footer: { color: '#888', fontSize: 14, marginTop: 20 },
  link: { color: '#e85d04', fontWeight: 600 },
}
