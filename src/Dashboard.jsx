import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import CandlestickChart from '../components/CandlestickChart.jsx'
import EntryForm from '../components/EntryForm.jsx'

const TREND_LABEL = { bull: 'BULL', bear: 'BEAR', flat: 'FLAT' }

export default function Dashboard() {
  const { token, user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  async function load() {
    try {
      const res = await api.entries(token)
      setData(res)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (token) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!user) return <Navigate to="/demo" replace />

  const latest = data?.candles?.[data.candles.length - 1]

  return (
    <div>
      <div className="eyebrow"><span className="pulse-dot" />NEDAKA. / SLEEP MARKET</div>
      <h1 className="page-title">今日の睡眠株、ご確認ください。</h1>

      <EntryForm onSaved={load} />

      {error && <p className="error-message">{error}</p>}

      {data && data.candles.length > 0 && (
        <>
          <div className="ticker-row">
            <div className="ticker-price">
              <span className="ticker-value mono">{latest.close.toFixed(1)}</span>
              <span className={`ticker-change mono ${latest.close >= latest.open ? 'bull' : 'bear'}`}>
                {latest.close >= latest.open ? '▲' : '▼'} {Math.abs(latest.close - latest.open).toFixed(1)}
              </span>
            </div>
            <a href={api.reportUrl()} className="download-button" download>
              <span>↓</span> 決算レポートPDF
            </a>
          </div>

          <div className="legend-row mono">
            <span><i className="swatch ma7" />MA7</span>
            <span><i className="swatch ma30" />MA30</span>
          </div>

          <CandlestickChart candles={data.candles} ma7={data.ma7} ma30={data.ma30} />

          <div className={`analyst-box trend-${data.summary.trend}`}>
            <div className="analyst-tag mono">{TREND_LABEL[data.summary.trend]}</div>
            <h3>{data.summary.headline}</h3>
            <p>{data.summary.body}</p>
          </div>

          <h3 className="section-label mono">直近の値動き</h3>
          <ul className="entry-list">
            {[...data.candles].reverse().slice(0, 10).map((c) => (
              <li key={c.date} className={c.is_bullish ? 'bull' : 'bear'}>
                <span className="mono entry-date">{c.date}</span>
                <span className="entry-hours">{c.sleep_hours}時間睡眠</span>
                <span className="mono entry-score">{c.close.toFixed(1)}</span>
                <span className="entry-comment">{c.comment}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {data && data.candles.length === 0 && (
        <p className="empty-state">まだ記録がありません。今日の睡眠を記録して、最初のローソク足を作りましょう。</p>
      )}
    </div>
  )
}
