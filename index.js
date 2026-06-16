import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"] 
});

app.get("/", (req, res) => {
  res.send("Socket Server Running Successfully on Vercel!");
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);
  });

  socket.on("send", (message) => {
    console.log("Message:", message);
    io.to(message.room).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});