import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-form-wrap">
      <h1 className="page-title">ログイン</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>ユーザー名
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>パスワード
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'ログイン中…' : 'ログイン'}</button>
      </form>
      <p className="auth-switch">アカウントをお持ちでない方は<Link to="/register">こちら</Link></p>
    </div>
  )
}
