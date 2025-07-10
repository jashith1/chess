'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { UserData } from '@/lib/firebase';

interface GameLobbyProps {
  userData: UserData;
  onGameStart: (gameData: any) => void;
}

export default function GameLobby({ userData, onGameStart }: GameLobbyProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLookingForGame, setIsLookingForGame] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>('');

  useEffect(() => {
    // Connect to socket server
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Listen for game events
    newSocket.on('waiting-for-opponent', () => {
      setGameStatus('Waiting for opponent...');
    });

    newSocket.on('game-started', (gameData) => {
      console.log('Game started:', gameData);
      setIsLookingForGame(false);
      setGameStatus('');
      onGameStart(gameData);
    });

    newSocket.on('opponent-disconnected', () => {
      setGameStatus('Opponent disconnected');
      setIsLookingForGame(false);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [onGameStart]);

  const findGame = () => {
    if (!socket) return;
    
    setIsLookingForGame(true);
    setGameStatus('Looking for opponent...');
    
    // Send player data to server for matchmaking
    socket.emit('find-game', {
      uid: userData.uid,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      gamesPlayed: userData.gamesPlayed,
      wins: userData.wins
    });
  };

  const cancelSearch = () => {
    if (socket) {
      socket.disconnect();
      // Reconnect to reset state
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);
    }
    setIsLookingForGame(false);
    setGameStatus('');
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Multiplayer Chess</h2>
      
      {!isLookingForGame ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Search for another player:</p>
          <button
            onClick={findGame}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            Find Game
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            {/* Loading spinner */}
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-lg font-semibold mb-2">{gameStatus}</p>
          <p className="text-gray-600 mb-4">
            {gameStatus === 'Waiting for opponent...' 
              ? 'Another player will join shortly' 
              : 'Searching for available players'}
          </p>
          <button
            onClick={cancelSearch}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel Search
          </button>
        </div>
      )}
    </div>
  );
}