import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Demo from './pages/Demo.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/demo')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand"><span className="dot"></span>Nedaka.</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span className="mono">@{user.username}</span>
            <button className="link-btn" onClick={handleLogout}>ログアウト</button>
          </>
        ) : (
          <>
            <Link to="/demo">デモを見る</Link>
            <Link to="/login">ログイン</Link>
            <Link to="/register" className="btn-small">はじめる</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div className="page">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}
