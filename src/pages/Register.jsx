import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Particles from '../components/Particles'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Password validation (same as original)
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/
    if (!pwRegex.test(password)) {
      setError('Password must be 6+ chars with a letter, number, and special character')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, username)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/login')
    }
  }

  return (
    <div style={styles.page}>
      <Particles />
      <div style={styles.card}>
        <div style={styles.emoji}>📝</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join and explore delicious recipes</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" className="btn-primary" style={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
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
  error: { color: '#e63946', fontSize: 13, textAlign: 'left' },
  btn: { width: '100%', padding: '14px', fontSize: 16, marginTop: 4 },
  footer: { color: '#888', fontSize: 14, marginTop: 20 },
  link: { color: '#e85d04', fontWeight: 600 },
}
