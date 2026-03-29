import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      await signOut()
      navigate('/login')
    }
  }

  return (
    <nav style={styles.nav}>
      <Link to={isAdmin ? '/admin' : '/home'} style={styles.logo}>
        🍽 <span style={styles.logoText}>Food Recipes</span>
      </Link>

      <div style={styles.links}>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>
        {user && !isAdmin && (
          <Link to="/favourites" style={styles.link}>❤️ Favourites</Link>
        )}
        {user && isAdmin && (
          <Link to="/admin/import" style={styles.link}>🌐 Import Recipe</Link>
        )}
        {user && isAdmin && (
          <Link to="/admin/add" style={styles.link}>➕ Add Recipe</Link>
        )}
        {user && (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        )}
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={styles.hamburger}>☰</button>
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/about" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Contact</Link>
          {user && !isAdmin && (
            <Link to="/favourites" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>❤️ Favourites</Link>
          )}
          {user && isAdmin && (
            <Link to="/admin/add" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>➕ Add Recipe</Link>
          )}
          {user && (
            <button onClick={handleLogout} style={styles.mobileLogout}>Logout</button>
          )}
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'rgba(13,13,13,0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #2a2a2a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 20,
    fontWeight: 700,
    color: '#f0ece4',
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    color: '#e85d04',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  link: {
    color: '#888',
    fontSize: 14,
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  logoutBtn: {
    background: 'transparent',
    color: '#e63946',
    border: '1px solid #e63946',
    fontSize: 13,
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  hamburger: {
    display: 'none',
    background: 'transparent',
    color: '#f0ece4',
    fontSize: 22,
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#161616',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 24px',
    gap: 16,
  },
  mobileLink: {
    color: '#888',
    fontSize: 15,
    fontWeight: 500,
  },
  mobileLogout: {
    background: 'transparent',
    color: '#e63946',
    border: '1px solid #e63946',
    fontSize: 13,
    padding: '10px',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    textAlign: 'left',
  },
}
