import { useState } from 'react'
import type { GameState } from './types'
import { LobbyScreen } from './LobbyScreen'
import { RoomWaitingScreen } from './RoomWaitingScreen'
import { OnlineGameRoom } from './OnlineGameRoom'


type AppScreen =
  | { screen: 'lobby' }
  | { screen: 'room'; roomCode: string; playerId: string; playerIndex: number; isHost: boolean }
  | { screen: 'online'; roomCode: string; playerId: string; playerIndex: number; game: GameState }

export default function App() {
  const [appScreen, setAppScreen] = useState<AppScreen>({ screen: 'lobby' })

  function handleCreateRoom(roomCode: string, playerId: string, playerIndex: number) {
    setAppScreen({ screen: 'room', roomCode, playerId, playerIndex, isHost: true })
  }

  function handleJoinRoom(roomCode: string, playerId: string, playerIndex: number) {
    setAppScreen({ screen: 'room', roomCode, playerId, playerIndex, isHost: false })
  }

  function handleGameStart(state: GameState, roomCode: string, playerId: string, playerIndex: number) {
    setAppScreen({
      screen: 'online',
      roomCode,
      playerId,
      playerIndex,
      game: state,
    })
  }

  function handleLeaveRoom() {
    setAppScreen({ screen: 'lobby' })
  }

  if (appScreen.screen === 'lobby') {
    return (
      <>
        <LobbyScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      </>
    )
  }

  if (appScreen.screen === 'room') {
    return (
      <>
        <RoomWaitingScreen
        roomCode={appScreen.roomCode}
        playerId={appScreen.playerId}
        playerIndex={appScreen.playerIndex}
        isHost={appScreen.isHost}
        onGameStart={handleGameStart}
        onBack={handleLeaveRoom}
      />
      </>
    )
  }

  // appScreen.screen === 'online'
  return (
    <>
      <OnlineGameRoom
      roomCode={appScreen.roomCode}
      playerId={appScreen.playerId}
      playerIndex={appScreen.playerIndex}
      initialState={appScreen.game}
      onLeave={handleLeaveRoom}
    />
    </>
  )
}
