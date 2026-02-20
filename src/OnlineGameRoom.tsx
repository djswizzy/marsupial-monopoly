import { useState, useEffect, useRef, useCallback } from 'react'
import type { GameState } from './types'
import type { GameAction } from './gameLogic'
import type { LogEntry } from './GameLog'
import { GameBoard } from './GameBoard'
import { GameOver } from './GameOver'

type Props = {
  roomCode: string
  playerId: string
  playerIndex: number
  initialState: GameState
  onLeave: () => void
}

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')

export function OnlineGameRoom({
  roomCode,
  playerId,
  playerIndex,
  initialState,
  onLeave,
}: Props) {
  const [state, setState] = useState<GameState>(initialState)
  const [serverLogEntries, setServerLogEntries] = useState<LogEntry[]>([])
  const pollingRef = useRef<number | null>(null)
  const lastStateHashRef = useRef<string>('')

  const dispatch = useCallback(
    async (action: GameAction, applyFirst?: GameAction) => {
      const { type, ...payload } = action as unknown as Record<string, unknown>
      const applyFirstPayload = applyFirst
        ? (() => {
            const { type: tf, ...pf } = applyFirst as unknown as Record<string, unknown>
            return { type: tf, payload: pf }
          })()
        : undefined

      try {
        const res = await fetch(`${API_BASE}/api/room/${roomCode}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerId,
            type,
            payload,
            applyFirst: applyFirstPayload,
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          console.error('Action failed:', data.error)
          return
        }
        const data = await res.json()
        setState(data.gameState ?? data)
        if (Array.isArray(data.gameLog)) setServerLogEntries(data.gameLog)
      } catch (err) {
        console.error('Action error:', err)
      }
    },
    [roomCode, playerId]
  )

  useEffect(() => {
    let mounted = true

    async function pollGameState() {
      try {
        const res = await fetch(`${API_BASE}/api/room/${roomCode}?playerId=${playerId}`, {
          cache: 'no-store',
          headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
        })
        if (!res.ok) return
        const data = await res.json()
        if (data.status === 'playing' && data.gameState) {
          const stateHash = JSON.stringify(data.gameState)
          if (stateHash !== lastStateHashRef.current && mounted) {
            lastStateHashRef.current = stateHash
            setState(data.gameState)
          }
          // Always sync log from server so all players see the same history
          if (mounted && Array.isArray(data.gameLog)) {
            setServerLogEntries(data.gameLog)
          }
        }
      } catch (err) {
        // Silently handle polling errors
      }
    }

    pollGameState()
    const interval = setInterval(pollGameState, 500) // Poll every 500ms so all players see log updates quickly
    pollingRef.current = interval as unknown as number

    return () => {
      mounted = false
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [roomCode, playerId])

  if (state.phase === 'gameover') {
    return <GameOver state={state} onReset={onLeave} />
  }

  return (
    <GameBoard
      state={state}
      setState={setState}
      dispatch={dispatch}
      playerIndex={playerIndex}
      serverLogEntries={serverLogEntries}
    />
  )
}
