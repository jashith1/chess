//@TO-DO: Increase firestore user counter on game complete, let board flip for black side players
'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ChessBoard from '@/components/ChessBoard';
import Auth from '@/components/Auth';
import GameLobby from '@/components/GameLobby';
import { UserData } from '@/lib/firebase';

export default function Home() {
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null | string>('loading');
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (userData && !socket) {
      const newSocket = io('http://localhost:3001');
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

  const handleGameStart = (gameData: any) => {
    setCurrentGame(gameData);
  };

  const handleGameEnd = () => {
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

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-8">
        <Auth onUserDataChange={handleUserDataChange} />
        
        {userData && typeof userData !== "string" && socket && !currentGame && (
          <GameLobby 
            userData={userData} 
            socket={socket}
            onGameStart={handleGameStart} 
          />
        )}
        
        {typeof userData !== "string" && currentGame && socket && (
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
        
        {!userData && userData != "loading" && (
          <div className="mt-6">
            <div className="p-4 rounded-lg shadow-md mb-4 text-center">
              <p className="text-gray-600">Sign in to play multiplayer, or play locally below:</p>
            </div>
            <ChessBoard isMultiplayer={false} />
          </div>
        )}
      </div>
    </main>
  );
}