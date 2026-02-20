import type { Market } from './types'
import { COMMODITY_NAMES, COMMODITY_EMOJI } from './data/cards'
import { COMMODITIES, COMMODITY_PRICE_MIN, COMMODITY_PRICE_MAX } from './gameLogic'

type Props = { market: Market }

export function MarketStrip({ market }: Props) {
  return (
    <div className="market-strip card">
      <div className="market-ladders">
        {COMMODITIES.map(c => {
          const price = market[c]
          const min = COMMODITY_PRICE_MIN[c]
          const max = COMMODITY_PRICE_MAX[c]
          const clampedPrice = Math.min(Math.max(price, min), max)
          const bandCount = max - min + 1
          const bottomOfBandPct = min === max ? 0 : ((clampedPrice - min) / (max - min)) * 100
          const halfBandPct = bandCount > 0 ? 50 / bandCount : 0
          const centerPct = bottomOfBandPct + halfBandPct
          const ticks = Array.from({ length: bandCount }, (_, i) => min + i)
          return (
            <div key={c} className="ladder-cell">
              <span className="commodity-name">{COMMODITY_NAMES[c]}</span>
              <div className="ladder-track">
                <div className="ladder-ticks">
                  {ticks.map(t => (
                    <div key={t} className="ladder-tick">
                      {t % 2 === 1 ? (
                        <span className="tick-value left">${t}</span>
                      ) : (
                        <span className="tick-value right">${t}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div
                  className="ladder-emoji"
                  style={{ bottom: `${centerPct}%` }}
                  title={`${COMMODITY_NAMES[c]}: $${price}`}
                >
                  {COMMODITY_EMOJI[c]}
                </div>
              </div>
              <span className="price-label">${price}</span>
            </div>
          )
        })}
      </div>
      <style>{`
        .market-strip.card {
          background-image: url('/wooden-floor-background.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .market-ladders {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: space-around;
        }
        .ladder-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 6.5rem;
        }
        .ladder-cell .commodity-name {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 500;
          background: var(--surface2);
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          border: 1px solid var(--border);
        }
        .ladder-track {
          position: relative;
          width: 6.5rem;
          height: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          border-left: 3px solid var(--border);
          border-right: 3px solid var(--border);
          display: flex;
          flex-direction: row;
          align-items: stretch;
          justify-content: center;
        }
        .ladder-ticks {
          display: flex;
          flex-direction: column-reverse;
          flex: 1;
          min-height: 100%;
          max-width: 100%;
        }
        .ladder-tick {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 0;
          border-bottom: 1px solid var(--border);
          padding: 0 0.15rem;
        }
        .ladder-tick:first-child {
          border-bottom: none;
        }
        .tick-value {
          font-size: 1.15rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .tick-value.left {
          margin-right: auto;
        }
        .tick-value.right {
          margin-left: auto;
        }
        .ladder-emoji {
          position: absolute;
          left: 0;
          right: 0;
          margin-left: auto;
          margin-right: auto;
          width: fit-content;
          transform: translateY(50%);
          font-size: 2.75rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
          z-index: 2;
          transition: bottom 0.25s ease-out;
          pointer-events: none;
        }
        .ladder-cell .price-label {
          margin-top: 0.5rem;
          font-weight: 700;
          color: var(--accent);
          font-size: 1.75rem;
        }
      `}</style>
    </div>
  )
}
