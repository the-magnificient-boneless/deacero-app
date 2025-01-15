/* // src/socket.js
const socketIo = require("socket.io");

const setupSocket = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", (msg) => {
      console.log("Message received: " + msg);
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

module.exports = setupSocket;
 */
let connectedUsers = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on("join", ({ username }) => {
      connectedUsers[socket.id] = username;
      io.emit("userList", Object.values(connectedUsers));
    });

    socket.on("sendMessage", (message) => {
      io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
      delete connectedUsers[socket.id];
      io.emit("userList", Object.values(connectedUsers));
    });
  });
};
