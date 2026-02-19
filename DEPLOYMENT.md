# Deployment Guide for Vercel

This game has been converted from Socket.io to polling-based updates for Vercel compatibility.

## Changes Made

1. **API Endpoints**: Created serverless functions in `/api/room/`:
   - `POST /api/room/create` - Create a new room
   - `POST /api/room/join` - Join an existing room
   - `GET /api/room/[roomCode]` - Poll for room status and game state
   - `POST /api/room/[roomCode]/start` - Start the game (host only)
   - `POST /api/room/[roomCode]/action` - Submit game actions

2. **Client Updates**: 
   - `RoomWaitingScreen` now polls every 2 seconds for room updates
   - `OnlineGameRoom` now polls every 1 second for game state updates
   - Actions are sent via HTTP POST instead of Socket.io events

3. **Removed Dependencies**: 
   - Socket.io is no longer used in the client (but still in package.json for local dev server)
   - The `server/index.ts` file remains for local development but isn't needed for Vercel

## Deploying to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project or create a new one.

3. **Environment Variables**: None required for basic functionality.

4. **Build Settings**: Vercel will automatically detect Vite and use the build settings from `vercel.json`.

## Important Notes

- **In-Memory Store**: The current implementation uses an in-memory store (`api/_store.ts`). This means:
  - Game state is lost when serverless functions restart
  - Multiple Vercel instances won't share state
  - **For production**, you should replace this with Vercel KV, Postgres, or another persistent store

- **Polling Frequency**: 
  - Room waiting screen: 2 seconds
  - Game state: 1 second
  - You can adjust these in `RoomWaitingScreen.tsx` and `OnlineGameRoom.tsx` if needed

- **Local Development**: 
  - For local development with the Socket.io server, run `npm run dev:all`
  - For testing Vercel functions locally, use `vercel dev`

## Next Steps for Production

1. Replace `api/_store.ts` with a persistent store (Vercel KV recommended)
2. Consider adding rate limiting for API endpoints
3. Add error tracking (e.g., Sentry)
4. Optimize polling intervals based on usage patterns
