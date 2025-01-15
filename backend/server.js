require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Attach IO instance to the app
require("./src/lib/socket")(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
