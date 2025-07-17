'use client';
import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { updateUserStats } from '@/lib/userData';
import { ChessBoardProps, moveData } from '@/types/game';

const PIECES = {
  'wK': '♚', 'wQ': '♛', 'wR': '♜', 'wB': '♝', 'wN': '♞', 'wP': '♟',
  'bK': '♔', 'bQ': '♕', 'bR': '♖', 'bB': '♗', 'bN': '♘', 'bP': '♙',
};

export default function ChessBoard({ gameData, socket, isMultiplayer = false, userData }: ChessBoardProps) {
  // Create a new chess game instance
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
  const [statsUpdated, setStatsUpdated] = useState(false); // Prevent duplicate updates

  // Initialize multiplayer game state
  useEffect(() => {
    if (isMultiplayer && gameData && socket) {
      setPlayerColor(gameData.color);

      // Set initial game state
      setGame(new Chess(gameData.fen));

      // Define event handlers
      const handleMoveMade = (data: moveData) => {
        setGame(new Chess(data.fen));
        setSelectedSquare(null);
        
        if (data.isGameOver) {
          setGameStatus('Game Over');
        }
      };

      const handleInvalidMove = (data: {reason: string}) => {
        console.log('Invalid move:', data.reason);
        setSelectedSquare(null)
      };

      const handleGameEnded = async (data: {winner: string, reason: string}) => {
        console.log('Game ended:', data);
        let message = '';
        let playerWon = false;

        if (data.winner) {
          playerWon = data.winner === gameData.color;
          message = `${data.winner === gameData.color ? 'You' : 'Opponent'} won by ${data.reason}!`;
        } else {
          message = `Game ended in a ${data.reason}`;
        }
        setGameStatus(message);

        if (userData && userData.uid && !statsUpdated) {
          setStatsUpdated(true);
          try {
            await updateUserStats(userData.uid, playerWon);
            console.log('User stats updated successfully');
            
          } catch (error) {
            console.error('Failed to update user stats:', error);
          }
        }
      };

      const handleOpponentDisconnected = () => {
        setGameStatus('Opponent disconnected');
      };

      // Listen for game events
      socket.on('move-made', handleMoveMade);
      socket.on('invalid-move', handleInvalidMove);
      socket.on('game-ended', handleGameEnded);
      socket.on('opponent-disconnected', handleOpponentDisconnected);

      // Cleanup listeners on unmount
      return () => {
        socket.off('move-made', handleMoveMade);
        socket.off('invalid-move', handleInvalidMove);
        socket.off('game-ended', handleGameEnded);
        socket.off('opponent-disconnected', handleOpponentDisconnected);
      };
    }
  }, [isMultiplayer, gameData, socket]);

  // Get the current board position
  const board = game.board();

  // Check if it's the player's turn
  const isPlayerTurn = () => {
    if (!isMultiplayer) return true;
    if (!playerColor) return false;
    
    const currentTurn = game.turn();
    return (currentTurn === 'w' && playerColor === 'white') || 
           (currentTurn === 'b' && playerColor === 'black');
  };

  // Handle click
  const handleSquareClick = (row: number, col: number) => {
    if (game.isGameOver()) {
      // Don't allow changes after game over
      return;
    }

    // In multiplayer, only allow moves on player's turn
    if (isMultiplayer && !isPlayerTurn()) {
      return;
    }

    // Convert row and col num to chess notation (like a8)
    const actualRow = (isMultiplayer && playerColor === 'black') ? (7 - row) : row;
    const square = (String.fromCharCode(97 + col) + (8 - actualRow)) as Square;
    
    if (selectedSquare === null) {
      // First click so select a piece
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      }
    } 
    else if (selectedSquare === square) {
      // Clicking same square so deselect
      setSelectedSquare(null);
    } 
    else if (game.get(square)?.color === game.turn()) {
      // Choosing new piece to move instead
      setSelectedSquare(square);
    }
    else {
      // Try to make the move
      if (isMultiplayer && socket && gameData) {
        // Send move to server for multiplayer
        socket.emit('make-move', {
          gameId: gameData.gameId,
          move: {
            from: selectedSquare,
            to: square,
          }
        });
      } else {
        // Local game - make move directly
        try {
          const move = game.move({
            from: selectedSquare,
            to: square,
          });
          
          if (move) {
            // Move was successful so update the game state
            setGame(new Chess(game.fen()));
            setSelectedSquare(null);
          }
        } catch (error) {
          // Invalid move
          console.log("invalid move", error)
        }
      }
    }
  };

  // Reset the game (only for local games)
  const resetGame = () => {
    if (!isMultiplayer) {
      setGame(new Chess());
      setSelectedSquare(null);
      setGameStatus('');
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isMultiplayer ? `Chess - Playing as ${playerColor}` : 'Chess!'}
      </h1>
      
      {/* Game info */}
      <div className="mb-4 text-center">
        {gameStatus && (
          <p className="text-lg font-bold text-red-500 mb-2">{gameStatus}</p>
        )}
        
        {!game.isGameOver() && !gameStatus && (
          <div>
            <p className="text-lg">
              Current turn: {game.turn() === 'w' ? 'White' : 'Black'}
            </p>
            {isMultiplayer && (
              <p className="text-sm text-gray-600">
                {isPlayerTurn() ? 'Your turn' : "Opponent's turn"}
              </p>
            )}
          </div>
        )}
        
        {game.isCheck() && !game.isCheckmate() && (
          <p className="text-red-500 font-bold">Check!</p>
        )}
        {game.isCheckmate() && (
          <p className="text-red-500 font-bold">Checkmate! {game.turn() === 'w' ? 'Black' : 'White'} wins!</p>
        )}
        {game.isStalemate() && (
          <p className="text-yellow-500 font-bold">{`Stalemate! It's a draw!`}</p>
        )}
      </div>

      {/* Chess board */}
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-800">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const displayRow = (isMultiplayer && playerColor === 'black') ? (7 - rowIndex) : rowIndex;
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const squareNotation = String.fromCharCode(97 + colIndex) + (8 - rowIndex);
            const isSelected = selectedSquare === squareNotation;
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-16 h-16 flex items-center justify-center text-4xl cursor-pointer brightness-100
                  ${isLight ? 'bg-green-500' : 'bg-zinc-500'}
                  ${isSelected ? 'ring-4 ring-blue-500 z-1' : ''}
                  hover:brightness-120
                  ${isMultiplayer && (!isPlayerTurn() || game.isGameOver()) ? 'cursor-not-allowed opacity-75' : ''}
                `}
                onClick={() => handleSquareClick(displayRow, colIndex)}
                style={{
                  order: displayRow * 8 + colIndex
                }}
              >
                {square && PIECES[`${square.color}${square.type.toUpperCase()}` as keyof typeof PIECES]}
              </div>
            );
          })
        )}
      </div>

      {/* Reset button (only for local games) */}
      {!isMultiplayer && (
        <button
          onClick={resetGame}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset Game
        </button>
      )}
    </div>
  );
}