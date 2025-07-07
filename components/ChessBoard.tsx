'use client';
import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';

const PIECES = {
  'wK': '♚', 'wQ': '♛', 'wR': '♜', 'wB': '♝', 'wN': '♞', 'wP': '♟',
  'bK': '♔', 'bQ': '♕', 'bR': '♖', 'bB': '♗', 'bN': '♘', 'bP': '♙',
};

export default function ChessBoard() {
  // Create a new chess game instance
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // Get the current board position
  const board = game.board();

  // Hanlde click
  const handleSquareClick = (row: number, col: number) => {
    if(game.isCheckmate()){
      //dont allow changes after checkmate
      return;
    }

    // Convert row and col num to chess notation (like a8)
    const square = (String.fromCharCode(97 + col) + (8 - row)) as Square;
    
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
    else if(game.get(square)?.color === game.turn()){
      // Choosing new piece to move instead
      setSelectedSquare(square)
    }
    else {
      // Try to make the move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
        });
        
        if (move) {
          // Move was successful so update the game state
          // Fen is the string representation of current chessboard
          setGame(new Chess(game.fen()));
          setSelectedSquare(null);
        }
      } catch (error) {
        // Invalid move so just deselect
        setSelectedSquare(null);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Chess!</h1>
      
      {/* Game info */}
      <div className="mb-4 text-center">
        {!game.isCheckmate() && <p className="text-lg">
          Current turn: {game.turn() === 'w' ? 'White' : 'Black'}
        </p>}
        {game.isCheck() && !game.isCheckmate() && (
          <p className="text-red-500 font-bold">Check!</p>
        )}
        {game.isCheckmate() && (
          <p className="text-red-500 font-bold">Checkmate! {game.turn() === 'w' ? 'Black' : 'White'} wins!</p>
        )}
        {game.isStalemate() && (
          <p className="text-yellow-500 font-bold">Stalemate! It's a draw!</p>
        )}
      </div>

      {/* Chess board */}
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-800">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
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
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {square && PIECES[`${square.color}${square.type.toUpperCase()}` as keyof typeof PIECES]}
              </div>
            );
          })
        )}
      </div>

      {/* Reset button */}
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reset Game
      </button>
    </div>
  );
}