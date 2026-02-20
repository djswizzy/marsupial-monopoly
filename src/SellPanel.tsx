import { useState } from 'react'
import type { Commodity, Market } from './types'
import { COMMODITY_NAMES, COMMODITY_EMOJI } from './data/cards'
import { COMMODITIES } from './gameLogic'

type Props = {
  commodities: Partial<Record<Commodity, number>>
  market: Market
  onSell: (commodity: Commodity, quantity: number, useExportCompany?: boolean) => void
  onClose: () => void
  /** Freight Company: can sell twice this turn. */
  hasFreightCompany?: boolean
  /** Number of sell actions already used this turn (0 or 1 when hasFreightCompany). */
  sellActionsThisTurn?: number
  /** Export Company: option to sell at +$N/unit (capped at board max). */
  hasExportCompany?: boolean
  exportBonusAmount?: number
  /** Board max price per commodity (for Export Company cap). */
  commodityPriceMax?: Partial<Record<Commodity, number>>
}

export function SellPanel({ commodities, market, onSell, onClose, hasFreightCompany = false, sellActionsThisTurn = 0, hasExportCompany = false, exportBonusAmount = 3, commodityPriceMax = {} }: Props) {
  const [selected, setSelected] = useState<Commodity | null>(null)
  const [qty, setQty] = useState(1)
  const [useExportCompany, setUseExportCompany] = useState(true)

  const have = selected ? (commodities[selected] ?? 0) : 0
  const basePrice = selected ? market[selected] : 0
  const maxPrice = selected && commodityPriceMax[selected] != null ? commodityPriceMax[selected]! : 12
  const effectivePrice = selected
    ? (hasExportCompany && useExportCompany ? Math.min(maxPrice, basePrice + exportBonusAmount) : basePrice)
    : 0
  const maxQty = Math.min(have, 10)
  const sellNumber = hasFreightCompany ? sellActionsThisTurn + 1 : 1
  const sellTotal = hasFreightCompany ? 2 : 1

  return (
    <div className="sell-overlay">
      <div className="sell-panel card">
        <h2>Sell commodities</h2>
        {hasFreightCompany ? (
          <p className="sell-panel-freight">You may sell <strong>twice</strong> this turn (Freight Company).</p>
        ) : (
          <p>Choose a commodity and quantity. Price will drop by the amount sold.</p>
        )}
        {hasFreightCompany && (
          <p className="sell-panel-count">Sell <strong>{sellNumber} of {sellTotal}</strong></p>
        )}
        <div className="commodity-buttons">
          {COMMODITIES.map(c => {
            const n = commodities[c] ?? 0
            if (n === 0) return null
            return (
              <button
                key={c}
                type="button"
                className={`secondary commodity-btn ${selected === c ? 'active' : ''}`}
                onClick={() => { setSelected(c); setQty(1); }}
              >
                <span className="commodity-emoji">{COMMODITY_EMOJI[c]}</span>
                <span className="commodity-label">{COMMODITY_NAMES[c]} ({n}) @ ${market[c]}</span>
              </button>
            )
          })}
        </div>
        {selected && have > 0 && (
          <>
            {hasExportCompany && (
              <label className="sell-panel-export">
                <input
                  type="checkbox"
                  checked={useExportCompany}
                  onChange={e => setUseExportCompany(e.target.checked)}
                />
                <span>Use Export Company (+${exportBonusAmount}/unit, max ${maxPrice})</span>
              </label>
            )}
            <div className="qty-row">
              <label>
                <span className="commodity-emoji">{selected && COMMODITY_EMOJI[selected]}</span>
                Quantity:
              </label>
              <input
                type="number"
                min={1}
                max={maxQty}
                value={qty}
                onChange={e => setQty(Math.max(1, Math.min(maxQty, parseInt(e.target.value, 10) || 1)))}
              />
              <span className="total">= ${effectivePrice * qty}</span>
              <button
                type="button"
                className="primary"
                onClick={() => onSell(selected, qty, hasExportCompany ? useExportCompany : undefined)}
              >
                Sell {qty} {selected && COMMODITY_EMOJI[selected]}
              </button>
            </div>
          </>
        )}
        <button type="button" className="secondary" onClick={onClose}>
          Close
        </button>
      </div>
      <style>{`
        .sell-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .sell-panel {
          max-width: 420px;
          padding: 1.5rem;
        }
        .sell-panel h2 {
          margin-bottom: 0.5rem;
        }
        .commodity-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .commodity-buttons .commodity-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .commodity-buttons .commodity-emoji {
          font-size: 1.25rem;
        }
        .commodity-buttons .active {
          border-color: var(--accent);
          background: var(--surface2);
        }
        .sell-panel-freight,
        .sell-panel-count {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }
        .sell-panel-count {
          color: var(--accent);
        }
        .sell-panel-export {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .sell-panel-export input {
          width: 1rem;
          height: 1rem;
        }
        .qty-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .qty-row input {
          width: 4rem;
          padding: 0.4rem;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text);
        }
        .qty-row .commodity-emoji {
          font-size: 1.1rem;
        }
        .qty-row .total {
          color: var(--accent);
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
