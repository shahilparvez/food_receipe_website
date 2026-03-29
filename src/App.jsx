import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import UserHome from './pages/UserHome'
import AdminHome from './pages/AdminHome'
import RecipeView from './pages/RecipeView'
import Favourites from './pages/Favourites'
import AddRecipe from './pages/AddRecipe'
import EditRecipe from './pages/EditRecipe'
import ImportRecipe from './pages/ImportRecipe'
import About from './pages/About'
import Contact from './pages/Contact'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="spinner" />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/home" replace />
  return children
}

export default function App() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={
        user ? <Navigate to={isAdmin ? '/admin' : '/home'} /> : <Navigate to="/login" />
      } />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={isAdmin ? '/admin' : '/home'} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
      <Route path="/recipe/:id" element={<ProtectedRoute><RecipeView /></ProtectedRoute>} />
      <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminHome /></ProtectedRoute>} />
      <Route path="/admin/add" element={<ProtectedRoute adminOnly><AddRecipe /></ProtectedRoute>} />
      <Route path="/admin/import" element={<ProtectedRoute adminOnly><ImportRecipe /></ProtectedRoute>} />
      <Route path="/admin/edit/:id" element={<ProtectedRoute adminOnly><EditRecipe /></ProtectedRoute>} />
    </Routes>
  )
}
