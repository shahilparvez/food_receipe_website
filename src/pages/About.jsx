import { Link } from 'react-router-dom'
import Particles from '../components/Particles'
import Navbar from '../components/Navbar'

export default function About() {
  return (
    <div className="page-wrap">
      <Particles />
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>About Us</h1>

          <p style={styles.p}>
            Welcome to <strong style={{ color: '#e85d04' }}>Food Recipes</strong> — your one-stop destination for discovering and exploring delicious dishes.
          </p>
          <p style={styles.p}>
            Search for your favourite dishes and click on any recipe to view the <strong>complete description</strong>, including ingredients and step-by-step preparation.
          </p>
          <p style={styles.p}>
            Want to eat without cooking? We've got you covered with quick links to <strong>Zomato</strong> and <strong>Swiggy</strong> so you can order instantly.
          </p>
          <p style={styles.p}>
            Prefer to cook at home? Find all the ingredients you need through <strong>Zepto</strong>, <strong>Instamart</strong>, and <strong>Blinkit</strong>.
          </p>
          <p style={styles.p}>
            Our goal is simple: make food discovery easy and give you two convenient options — <strong>cook it or order it</strong>.
          </p>
          <p style={styles.p}>
            This project was developed by <strong>Mohammed Rabbani</strong> as a web development project.
          </p>

          <Link to="/login">
            <button className="btn-primary" style={{ marginTop: 24 }}>← Back to Home</button>
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
    maxWidth: 680,
    width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36, fontWeight: 900,
    color: '#e85d04', marginBottom: 28,
  },
  p: { color: '#aaa', fontSize: 16, lineHeight: 1.8, marginBottom: 14 },
}
