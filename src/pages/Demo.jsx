import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import CandlestickChart from '../components/CandlestickChart.jsx'

const TREND_LABEL = { bull: 'BULL', bear: 'BEAR', flat: 'FLAT' }

export default function Demo() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.demo().then(setData).catch((err) => setError(err.message))
  }, [])

  const latest = data?.candles?.[data.candles.length - 1]

  return (
    <div>
      <div className="eyebrow"><span className="pulse-dot" />NEDAKA. / DEMO</div>
      <h1 className="page-title">サンプルデータで見る、Nedaka.</h1>

      <div className="demo-banner">
        <p>
          ここに表示されているのは、記録なしでも中身を確認できる<strong>サンプルデータ</strong>です。
          実際に自分の睡眠を記録したい場合は、アカウントを作成してください。
        </p>
        <Link to="/register" className="btn-small">アカウントを作る</Link>
      </div>

      {error && <p className="error-message">{error}</p>}

      {data && (
        <>
          <div className="ticker-row">
            <div className="ticker-price">
              <span className="ticker-value mono">{latest.close.toFixed(1)}</span>
              <span className={`ticker-change mono ${latest.close >= latest.open ? 'bull' : 'bear'}`}>
                {latest.close >= latest.open ? '▲' : '▼'} {Math.abs(latest.close - latest.open).toFixed(1)}
              </span>
            </div>
            <a href={api.demoReportUrl()} className="download-button" download>
              <span>↓</span> 決算レポートPDF（サンプル）
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
    </div>
  )
}
