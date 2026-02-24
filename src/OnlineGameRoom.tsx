import { useState, useEffect, useRef, useCallback } from 'react'
import type { GameState } from './types'
import type { GameAction } from './gameLogic'
import type { LogEntry } from './GameLog'
import { GameBoard } from './GameBoard'
import { GameOver } from './GameOver'
import { API_BASE, API_HEADERS, safeJson, withNgrokRetry } from './api'

type Props = {
  roomCode: string
  playerId: string
  playerIndex: number
  initialState: GameState
  onLeave: () => void
}

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
  const roomCodeRef = useRef(roomCode)
  const playerIdRef = useRef(playerId)
  roomCodeRef.current = roomCode
  playerIdRef.current = playerId

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
        const code = String(roomCodeRef.current || '').toUpperCase().trim()
        await withNgrokRetry(async () => {
          const res = await fetch(`${API_BASE}/api/room/${code}/action`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({
              playerId: playerIdRef.current,
              type,
              payload,
              applyFirst: applyFirstPayload,
            }),
          })
          if (!res.ok) {
            const data = await safeJson<{ error?: string }>(res)
            console.error('Action failed:', data.error)
            return
          }
          const data = await safeJson<{ gameState?: GameState; gameLog?: LogEntry[] }>(res)
          if (data.gameState != null) setState(data.gameState)
          if (Array.isArray(data.gameLog)) setServerLogEntries(data.gameLog)
        })
      } catch (err) {
        console.error('Action error:', err)
      }
    },
    [roomCode, playerId]
  )

  useEffect(() => {
    let mounted = true

    async function pollGameState() {
      const code = String(roomCodeRef.current || '').toUpperCase().trim()
      const pid = String(playerIdRef.current || '').trim()
      if (!code || !pid) return
      try {
        const res = await fetch(
          `${API_BASE}/api/room/${code}?playerId=${encodeURIComponent(pid)}&_=${Date.now()}`,
          { cache: 'no-store', headers: { ...API_HEADERS, Pragma: 'no-cache', 'Cache-Control': 'no-cache' } }
        )
        if (!res.ok) return
        const data = await safeJson<{ status?: string; gameState?: GameState; gameLog?: LogEntry[] }>(res)
        if (!mounted) return
        if (data.status === 'playing' && data.gameState) {
          setState(data.gameState)
        }
        if (Array.isArray(data.gameLog)) {
          setServerLogEntries(data.gameLog)
        }
      } catch {
        // Poll again on next interval
      }
    }

    pollGameState()
    const interval = setInterval(pollGameState, 400)
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
    <>
      <GameBoard
        state={state}
        setState={setState}
        dispatch={dispatch}
        playerIndex={playerIndex}
        serverLogEntries={serverLogEntries}
      />
    </>
  )
}
