import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Hello from Realtime Socket Chat Server</h1>");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("send", (message) => {
    io.to(message.room).emit("message", message);
  });
});

server.listen(5050, () => {
  console.log("Server running on 5050");
});