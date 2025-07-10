'use client';

import { useState } from 'react';
import ChessBoard from '@/components/ChessBoard';
import Auth from '@/components/Auth';
import GameLobby from '@/components/GameLobby';
import { UserData } from '@/lib/firebase';

export default function Home() {
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleGameStart = (gameData: any) => {
    setCurrentGame(gameData);
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-8">
        <Auth onUserDataChange={setUserData} />
        
        {userData && !currentGame && (
          <GameLobby userData={userData} onGameStart={handleGameStart} />
        )}
        
        {currentGame && (
          <div className="mt-6">
            <div className="p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold">
                Playing as {currentGame.color} vs {currentGame.opponent.displayName}
              </h3>
            </div>
            <ChessBoard />
          </div>
        )}
        
        {!userData && <ChessBoard />}
      </div>
    </main>
  );
}