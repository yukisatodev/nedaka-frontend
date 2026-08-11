import { useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function EntryForm({ onSaved }) {
  const { token } = useAuth()
  const [date, setDate] = useState(todayStr())
  const [bedtime, setBedtime] = useState('23:30')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [interruptions, setInterruptions] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setDone(false)
    try {
      await api.createEntry({ date, bedtime, wake_time: wakeTime, interruptions: Number(interruptions) }, token)
      setDone(true)
      onSaved?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <div className="entry-grid">
        <label>日付
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>就寝
          <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} required />
        </label>
        <label>起床
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} required />
        </label>
        <label>中途覚醒
          <input type="number" min={0} max={20} value={interruptions} onChange={(e) => setInterruptions(e.target.value)} />
        </label>
      </div>
      <button type="submit" disabled={submitting}>{submitting ? '記録中…' : 'この日を記録する'}</button>
      {done && <span className="save-ok mono">✓ 記録しました</span>}
      {error && <p className="error-message">{error}</p>}
    </form>
  )
}
