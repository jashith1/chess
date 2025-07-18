//@TO-DO: Increase firestore user counter on game complete, let board flip for black side players
'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ChessBoard from '@/components/ChessBoard';
import Auth from '@/components/Auth';
import GameLobby from '@/components/GameLobby';
import { GameData, UserData } from '@/types/game';

export default function Home() {
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [userData, setUserData] = useState<UserData | null | string>('loading');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [forceSinglePlayer, setForceSinglePlayer] = useState<boolean>(false)

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    console.log("Launching in", process.env.NEXT_PUBLIC_ENV, "environment")
    if (userData && !socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_ENV === "production"? `https://chess-socket-2s9c.onrender.com/`: `http://localhost:3001`);
      setSocket(newSocket);
    }
  }, [userData, socket]);

  // Clean up socket when user logs out
  useEffect(() => {
    if (!userData && socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [userData, socket]);

  const handleGameStart = (gameData: GameData) => {
    setCurrentGame(gameData);
  };

  const handleGameEnd = () => {
    setForceSinglePlayer(false);
    setCurrentGame(null);
    socket?.disconnect()
    setSocket(null)
  };

  const handleUserDataChange = (newUserData: UserData | null) => {
    setUserData(newUserData);
    // If user logs out, also end current game
    if (!newUserData && currentGame) {
      setCurrentGame(null);
    }
  };

  const chooseSinglePlayer = () => {
    setForceSinglePlayer(true)
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-8">
        <Auth onUserDataChange={handleUserDataChange} />
        
        {!forceSinglePlayer && userData && typeof userData !== "string" && socket && !currentGame && (
          <GameLobby 
            userData={userData} 
            socket={socket}
            onGameStart={handleGameStart} 
            chooseSinglePlayer={chooseSinglePlayer}
          />
        )}
        
        {!forceSinglePlayer && typeof userData !== "string" && currentGame && socket && (
          <div className="mt-6">
            <div className="p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold">
                Playing as {currentGame.color} vs {currentGame.opponent.displayName}
              </h3>
              <button
                onClick={handleGameEnd}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Leave Game
              </button>
            </div>
            <ChessBoard 
              gameData={currentGame} 
              socket={socket}
              isMultiplayer={true} 
              userData={userData || undefined}
            />
          </div>
        )}
        
        {((!userData && userData !== "loading") || (forceSinglePlayer)) && (
          <div className="mt-6">
            <div className="p-4 rounded-lg shadow-md mb-4 text-center">
              <p className="text-gray-600">You are playing a practice match</p>
              {!userData && userData !== "loading" && <>
                <p>Sign in to play online!</p>
              </>}
              {forceSinglePlayer && <button
                onClick={handleGameEnd}
                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              > Leave Game</button>}
            </div>
            <ChessBoard isMultiplayer={false} />
          </div>
        )}
      </div>
    </main>
  );
}