import { Link } from 'react-router-dom'
import Particles from '../components/Particles'
import Navbar from '../components/Navbar'

export default function Contact() {
  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Contact Us</h1>

          <div style={styles.avatar}>👨‍💻</div>
          <h2 style={styles.name}>Shahil Parvez A</h2>

          <div style={styles.info}>
            <a href="mailto:Shahilparvez111@gmail.com" style={styles.link}>
              📧 shahilparvez111@gmail.com
            </a>
            <a href="tel:+919363149511" style={styles.link}>
              📞 +91 93631 49511
            </a>
            <p style={styles.detail}>📍 Chennai, India</p>
            <p style={styles.detail}><strong style={{ color: '#e85d04' }}>Project:</strong> Food Recipes Website</p>
             <a href="https://github.com/shahilparvez/" target="_blank" rel="noreferrer" style={styles.link}>
              🐙 github.com/shahilparvez/
            </a>
            <a href="https://www.linkedin.com/in/shahil-parvez-426463374/" target="_blank" rel="noreferrer" style={styles.link}>
              💼 linkedin.com/in/shahil-parvez-426463374/
            </a>
          </div>

          <Link to="/login">
            <button className="btn-primary" style={{ marginTop: 28, width: '100%' }}>← Back to Home</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'relative', zIndex: 1,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: 'calc(100vh - 70px)', padding: '40px 24px',
  },
  card: {
    background: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: 20,
    padding: '48px 40px',
    maxWidth: 480,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36, fontWeight: 900,
    color: '#e85d04', marginBottom: 28,
  },
  avatar: {
    fontSize: 72, marginBottom: 16,
    background: '#1f1f1f',
    borderRadius: '50%',
    width: 100, height: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
    border: '2px solid #e85d04',
  },
  name: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22, fontWeight: 700,
    marginBottom: 24,
  },
  info: { display: 'flex', flexDirection: 'column', gap: 12 },
  link: { color: '#e85d04', fontSize: 15, fontWeight: 500, textDecoration: 'none' },
  detail: { color: '#aaa', fontSize: 15 },
}
