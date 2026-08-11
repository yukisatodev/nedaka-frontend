const CHART_H = 320
const PAD_TOP = 20
const PAD_BOTTOM = 34
const STEP = 26
const BODY_W = 14

export default function CandlestickChart({ candles, ma7, ma30 }) {
  if (!candles || candles.length === 0) {
    return <p className="empty-state">まだデータがありません。今日の睡眠を記録してみましょう。</p>
  }

  const allValues = candles.flatMap((c) => [c.high, c.low])
  ma7.forEach((v) => v !== null && allValues.push(v))
  ma30.forEach((v) => v !== null && allValues.push(v))

  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  const range = max - min || 1
  const innerH = CHART_H - PAD_TOP - PAD_BOTTOM

  const width = Math.max(candles.length * STEP + 40, 320)

  function y(value) {
    return PAD_TOP + innerH * (1 - (value - min) / range)
  }
  function x(i) {
    return 30 + i * STEP + STEP / 2
  }

  function linePath(series) {
    const points = series
      .map((v, i) => (v === null ? null : `${x(i)},${y(v)}`))
      .filter(Boolean)
    if (points.length === 0) return ''
    return `M ${points.join(' L ')}`
  }

  // y-axis grid ticks (4 lines)
  const ticks = [0, 1, 2, 3, 4].map((t) => min + (range * t) / 4)

  // show a date label roughly every N candles to avoid crowding
  const labelEvery = Math.max(1, Math.ceil(candles.length / 8))

  return (
    <div className="chart-scroll">
      <svg viewBox={`0 0 ${width} ${CHART_H}`} className="candle-chart" style={{ minWidth: width }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={26} y1={y(t)} x2={width - 6} y2={y(t)} className="chart-grid" />
            <text x={0} y={y(t) + 3} className="chart-tick mono">{Math.round(t)}</text>
          </g>
        ))}

        {ma30 && <path d={linePath(ma30)} className="ma-line ma30" fill="none" />}
        {ma7 && <path d={linePath(ma7)} className="ma-line ma7" fill="none" />}

        {candles.map((c, i) => {
          const cx = x(i)
          const bullish = c.is_bullish
          const bodyTop = y(Math.max(c.open, c.close))
          const bodyBottom = y(Math.min(c.open, c.close))
          const bodyHeight = Math.max(1.5, bodyBottom - bodyTop)
          return (
            <g key={c.date} className="candle-group">
              <line x1={cx} y1={y(c.high)} x2={cx} y2={y(c.low)} className={`wick ${bullish ? 'bull' : 'bear'}`} />
              <rect
                x={cx - BODY_W / 2}
                y={bodyTop}
                width={BODY_W}
                height={bodyHeight}
                className={`candle-body ${bullish ? 'bull' : 'bear'}`}
              />
              {i % labelEvery === 0 && (
                <text x={cx} y={CHART_H - 12} className="chart-date mono">
                  {c.date.slice(5)}
                </text>
              )}
              <title>{`${c.date}\n始値 ${c.open} / 高値 ${c.high} / 安値 ${c.low} / 終値 ${c.close}\n${c.comment}`}</title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
