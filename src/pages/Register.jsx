import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
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
      await register(username, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-form-wrap">
      <h1 className="page-title">はじめる</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>ユーザー名（英数字・アンダースコアのみ）
          <input value={username} onChange={(e) => setUsername(e.target.value)} minLength={3} maxLength={30} required />
        </label>
        <label>パスワード（6文字以上）
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? '登録中…' : 'アカウントを作る'}</button>
      </form>
      <p className="auth-switch">アカウントをお持ちの方は<Link to="/login">こちら</Link></p>
    </div>
  )
}
