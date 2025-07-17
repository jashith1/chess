import { Chess, Square } from 'chess.js';
import { Socket } from 'socket.io-client';

export interface GameData { 
  gameId: string;
  color: 'white' | 'black';
  opponent: UserData;
  fen: string;
}

export interface ChessBoardProps {
  gameData?: GameData;
  socket?: Socket;
  isMultiplayer?: boolean;
  userData?: UserData;
}

export interface moveData {
  move: {
    from: Square,
    to: Square
  },
  fen: string,
  turn: string,
  isGameOver: boolean
}

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  gamesPlayed: number;
  wins: number;
  createdAt: Date;
}

export interface GameLobbyProps {
  userData: UserData;
  socket: Socket;
  onGameStart: (gameData: any) => void;
  chooseSinglePlayer?: () => void;
}
