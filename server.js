const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.ENV === "production"? "https://chess-alpha-blond.vercel.app": "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Store waiting players and active games information on the server
const waitingPlayers = [];
const activeGames = new Map();

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Handle player looking for a game
  socket.on('find-game', (playerData) => {
    console.log('Player looking for game:', playerData.displayName);
    
    // Store player data on socket
    socket.playerData = playerData;
    
    if (waitingPlayers.length > 0) {
      // Match with waiting player
      const opponent = waitingPlayers.shift();
      startGame(socket, opponent);
    } else {
      // Add to waiting list
      waitingPlayers.push(socket);
      socket.emit('waiting-for-opponent');
      console.log('Player added to waiting list. Total waiting:', waitingPlayers.length);
    }
  });

  // Handle moves
  socket.on('make-move', (data) => {
    const { gameId, move } = data;
    const game = activeGames.get(gameId);
    
    if (!game) {
      console.log('Game not found:', gameId);
      return;
    }

    // Validate it's the player's turn
    const isWhitePlayer = game.white.id === socket.id;
    const isBlackPlayer = game.black.id === socket.id;
    const currentTurn = game.chess.turn();
    
    if ((currentTurn === 'w' && !isWhitePlayer) || (currentTurn === 'b' && !isBlackPlayer)) {
      socket.emit('invalid-move', { reason: 'Not your turn' });
      return;
    }

    // Try to make the move
    try {
      const moveResult = game.chess.move(move);
      if (moveResult) {
        console.log('Move made:', moveResult.san, 'in game', gameId);
        
        // Send move to both players
        io.to(gameId).emit('move-made', {
          move: moveResult,
          fen: game.chess.fen(),
          turn: game.chess.turn(),
          isGameOver: game.chess.isGameOver()
        });

        // Check if game is over
        if (game.chess.isGameOver()) {
          handleGameEnd(game, gameId);
        }
      } else {
        socket.emit('invalid-move', { reason: 'Illegal move' });
      }
    } catch (error) {
      console.log('Invalid move attempt:', error.message);
      socket.emit('invalid-move', { reason: error.message });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    // Remove from waiting list
    const waitingIndex = waitingPlayers.findIndex(p => p.id === socket.id);
    if (waitingIndex !== -1) {
      waitingPlayers.splice(waitingIndex, 1);
      console.log('Player removed from waiting list. Total waiting:', waitingPlayers.length);
    }
    
    // Handle game disconnect
    activeGames.forEach((game, gameId) => {
      if (game.white.id === socket.id || game.black.id === socket.id) {
        console.log('Player disconnected from game:', gameId);
        socket.to(gameId).emit('opponent-disconnected');
        activeGames.delete(gameId);
      }
    });
  });
});

// Start a new game between two players
function startGame(player1, player2) {
  const gameId = `game_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  
  // Randomly assign colors
  const isPlayer1White = Math.random() < 0.5;
  const white = isPlayer1White ? player1 : player2;
  const black = isPlayer1White ? player2 : player1;
  
  const game = {
    id: gameId,
    white: white,
    black: black,
    chess: new Chess(),
    startTime: new Date()
  };
  
  activeGames.set(gameId, game);
  
  // Join both players to the game room
  white.join(gameId);
  black.join(gameId);
  
  // Notify both players
  white.emit('game-started', {
    gameId: gameId,
    color: 'white',
    opponent: black.playerData,
    fen: game.chess.fen()
  });
  
  black.emit('game-started', {
    gameId: gameId,
    color: 'black',
    opponent: white.playerData,
    fen: game.chess.fen()
  });
  
  console.log(`Game started: ${gameId} - ${white.playerData.displayName} (white) vs ${black.playerData.displayName} (black)`);
}

// Handle game end
function handleGameEnd(game, gameId) {
  let winner = null;
  let reason = '';
  
  if (game.chess.isCheckmate()) {
    winner = game.chess.turn() === 'w' ? 'black' : 'white';
    reason = 'checkmate';
  } else if (game.chess.isStalemate()) {
    reason = 'stalemate';
  } else if (game.chess.isDraw()) {
    reason = 'draw';
  }
  
  io.to(gameId).emit('game-ended', {
    winner: winner,
    reason: reason
  });
  
  console.log(`Game ended: ${gameId} - Winner: ${winner || 'draw'} (${reason})`);
  activeGames.delete(gameId);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
  console.log(`running in ${process.env.ENV} environment`)
  console.log('Waiting for players to connect...');
});