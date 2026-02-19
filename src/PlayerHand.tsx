import type { ProductionCard, BuildingTile } from './types'
import { COMMODITY_NAMES, COMMODITY_EMOJI } from './data/cards'
import { getProductionList } from './gameLogic'

type Props = {
  hand: ProductionCard[]
  onProduce: (cardIndex: number) => void
  onPlayCard: (cardIndex: number) => void
  onToggleProductionIndex: (cardIndex: number, index: number) => void
  disabled: boolean
  canPlaySelected: boolean
  commodities: Partial<Record<string, number>>
  buildings: BuildingTile[]
  selectedCardIndex?: number | null
  productionSelection: number[]
  maxProduction: number
}

export function PlayerHand({
  hand,
  onProduce,
  onPlayCard,
  onToggleProductionIndex,
  disabled,
  canPlaySelected,
  commodities: _commodities,
  buildings: _buildings,
  selectedCardIndex = null,
  productionSelection,
  maxProduction,
}: Props) {
  return (
    <div className="player-hand card">
      <h3>Your hand — click a card to play it (pick {maxProduction} from the bottom when needed)</h3>
      <div className="hand-cards">
        {hand.map((card, i) => {
          const productionList = getProductionList(card)
          const isSelected = selectedCardIndex === i
          const playOnClick = isSelected && canPlaySelected
          return (
            <div
              key={card.id}
              className={`prod-card ${isSelected ? 'selected' : ''}`}
            >
              <button
                type="button"
                className="prod-card-top"
                onClick={() => (playOnClick ? onPlayCard(i) : onProduce(i))}
                disabled={disabled}
              >
                <div className="prod-card-emojis">
                  {card.priceIncrease.map((c, idx) => (
                    <span key={`price-${i}-${idx}`} className="prod-emoji" title={COMMODITY_NAMES[c]}>
                      {COMMODITY_EMOJI[c]}
                    </span>
                  ))}
                  {card.priceIncrease.length === 0 && (
                    <span className="prod-emoji none">—</span>
                  )}
                </div>
              </button>
              <div className="prod-card-divider" />
              <div className="prod-card-bottom">
                <div className="prod-card-emojis prod-slots">
                  {productionList.map((co, slotIndex) => {
                    const takeAll = productionList.length <= maxProduction
                    const slotSelected = !takeAll && isSelected && productionSelection.includes(slotIndex)
                    const canToggle = !takeAll && isSelected && !disabled && (
                      slotSelected || productionSelection.length < maxProduction
                    )
                    return (
                      <button
                        key={`prod-${i}-${slotIndex}`}
                        type="button"
                        className={`prod-emoji slot ${slotSelected ? 'selected' : ''} ${takeAll ? 'take-all' : ''}`}
                        title={COMMODITY_NAMES[co]}
                        disabled={!canToggle}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (canToggle) onToggleProductionIndex(i, slotIndex)
                        }}
                      >
                        {COMMODITY_EMOJI[co]}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <style>{`
        .player-hand {
          flex: 1;
          min-width: 440px;
          min-height: 200px;
        }
        .player-hand h3 {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .hand-cards {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .prod-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0;
          min-width: 132px;
          width: 132px;
          min-height: 176px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: center;
          overflow: hidden;
          transition: transform 0.2s ease, border-color 0.15s, box-shadow 0.15s;
        }
        .prod-card:hover {
          border-color: var(--accent);
          transform: translateY(-8px);
        }
        .prod-card.selected,
        .prod-card.selected:hover {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent-dim);
          transform: translateY(-8px);
        }
        .prod-card-top, .prod-card-bottom {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.65rem;
          min-height: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          font: inherit;
          color: inherit;
        }
        .prod-card-top:disabled {
          cursor: default;
        }
        .prod-card-top {
          background: #2c4a6e;
          border-radius: 8px 8px 0 0;
        }
        .prod-card-divider {
          height: 2px;
          background: var(--border);
          flex: none;
        }
        .prod-card-bottom {
          background: #6e2c2c;
          border-radius: 0 0 8px 8px;
        }
        .prod-card-emojis {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2rem;
          justify-content: center;
          align-items: center;
        }
        .prod-card-bottom .prod-card-emojis {
          max-width: 100%;
        }
        .prod-emoji {
          font-size: 1.35rem;
          line-height: 1;
        }
        .prod-emoji.slot {
          padding: 0.12rem;
          border-radius: 6px;
          border: 2px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .prod-emoji.slot:hover:not(:disabled) {
          background: rgba(184, 84, 80, 0.15);
          border-color: var(--accent-dim);
        }
        .prod-emoji.slot.selected {
          border-color: var(--accent);
          background: rgba(184, 84, 80, 0.25);
        }
        .prod-emoji.slot:disabled {
          cursor: default;
        }
        .prod-emoji.slot.take-all {
          cursor: default;
          pointer-events: none;
        }
        .prod-emoji.none {
          font-size: 1rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
