# A multiplayer chess webapp
A multiplayer chess web application built with **Next.js** and **Socket.IO**, enabling real-time matchmaking and interactive game sessions. \
This app also supports Google OAuth for user authentication and uses **Firestore** to store user data such as games played, wins, etc.

## Trying it out locally
Make sure to have **node.js** and **npm** installed. \
Then run: 
```bash
git clone https://github.com/jashith1/chess
cd chess
npm install
npm run dev
```
You can now navigate to localhost:3000 to try out the game. \
Note: ```npm run dev``` will run both the front end and websocket server in parallel. 

## How it works
- WebSockets enable bidirectional communication between the client and server, which is essential for any real-time, multi-user application.
- When a user clicks Find Game, a request is sent to the server.
- The server attempts to match the user with someone already in the queue. If no one is waiting, the user is added to the queue.
- Once a match is found, a game instance is created and relevant details are sent to both clients.
- The clients parse the game data and display the appropriate board and player information.
- When a user makes a move, it is sent to the server for validation. If valid, the move is broadcasted to both clients and rendered on their boards.
- On each move the client also checks for any additional information (such as check, checkmake, etc) and accordingly display the board. 