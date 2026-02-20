import type { BuildingTile } from './types'

/** Modal showing full building effect; render when building is non-null. Always shows definition (e.g. when opened via "i" from Your buildings). */
export function BuildingInfoModal({ building, onClose }: { building: BuildingTile | null; onClose: () => void }) {
  if (!building) return null
  return (
    <div className="building-info-overlay" onClick={onClose}>
      <div className="building-info-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="building-info-header">
          <h3>{building.name}</h3>
          <button type="button" className="building-info-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p className="building-info-desc">{building.description}</p>
        <p className="building-info-cost">Cost: ${building.cost}</p>
      </div>
    </div>
  )
}

const SHORT_DESC_LEN = 52

function shortDesc(desc: string): string | null {
  const t = desc.trim()
  if (t.length <= SHORT_DESC_LEN) return t || null
  const oneLine = t.split(/\n/)[0].trim()
  if (oneLine.length <= SHORT_DESC_LEN) return oneLine
  return oneLine.slice(0, SHORT_DESC_LEN - 3).trim() + '...'
}

type Props = {
  buildings: BuildingTile[]
  onSelect: (index: number) => void
  onConfirmBuy: (index: number) => void
  currentPlayerMoney: number
  selectedBuildingIndex?: number | null
  selectionDisabled?: boolean
  onOpenBuildingInfo: (b: BuildingTile) => void
}

export function BuildingOffer({ buildings, onSelect, onConfirmBuy, currentPlayerMoney, selectedBuildingIndex = null, selectionDisabled = false, onOpenBuildingInfo }: Props) {
  return (
    <div className="building-offer">
      <div className="building-tiles">
        {buildings.map((b, i) => {
          const isSelected = selectedBuildingIndex === i
          const canAfford = currentPlayerMoney >= b.cost
          const short = shortDesc(b.description)
          return (
          <div
            key={b.id}
            role="button"
            tabIndex={0}
            className={`building-tile card ${isSelected ? 'selected' : ''} ${selectionDisabled || !canAfford ? 'disabled' : ''}`}
            onClick={() => !(selectionDisabled || !canAfford) && (isSelected && canAfford ? onConfirmBuy(i) : onSelect(i))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!(selectionDisabled || !canAfford)) (isSelected && canAfford ? onConfirmBuy(i) : onSelect(i)) } }}
          >
            <button
              type="button"
              className="building-tile-info"
              aria-label="Full effect"
              onClick={(e) => { e.stopPropagation(); onOpenBuildingInfo(b) }}
            >
              i
            </button>
            <div className="b-content">
              <div className="b-name">{b.name}</div>
              {short && <div className="b-desc">{short}</div>}
            </div>
            <div className="b-cost" aria-label={`Cost ${b.cost}`}>${b.cost}</div>
          </div>
          )
        })}
      </div>
      <style>{`
        .building-tiles {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .building-tile {
          position: relative;
          text-align: center;
          width: 140px;
          aspect-ratio: 1;
          padding: 0.6rem;
          padding-bottom: 2rem;
          background: #e8dcc8;
          color: #1a1410;
          transition: transform 0.2s ease, border-color 0.15s, box-shadow 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .building-tile.disabled {
          pointer-events: none;
          opacity: 0.7;
        }
        .building-tile .building-tile-info {
          pointer-events: auto;
        }
        .building-tile-info {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text-muted);
          font-size: 0.7rem;
          font-weight: 700;
          font-style: italic;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
        }
        .building-tile-info:hover {
          background: var(--accent);
          color: var(--text);
        }
        .building-tile:not(.selected):hover:not(:disabled) {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px var(--accent-dim);
        }
        .building-tile .b-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }
        .building-tile .b-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #1a1410;
          line-height: 1.2;
        }
        .building-tile .b-desc {
          font-size: 0.8rem;
          color: #2d2520;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .building-tile .b-cost {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(145deg, #d4af37, #b8962e);
          color: #1a1410;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .building-tile.selected,
        .building-tile.selected:hover {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent-dim);
          transform: translateY(-8px);
        }
        .building-info-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .building-info-modal {
          max-width: 360px;
          padding: 1.25rem;
        }
        .building-info-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .building-info-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        .building-info-close {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
          line-height: 1;
        }
        .building-info-close:hover {
          color: var(--text);
        }
        .building-info-desc {
          margin: 0 0 0.75rem;
          font-size: 0.9rem;
          line-height: 1.4;
          white-space: pre-wrap;
        }
        .building-info-cost {
          margin: 0;
          font-size: 0.9rem;
          color: var(--accent);
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
