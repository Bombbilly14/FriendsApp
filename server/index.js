import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import morgan from "morgan"
import authRoutes from "./routes/auth.js"
import { saveMessage, getPrivateMessage } from './controllers/message.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);


  socket.on('join chat', ({ userId }) => {
    console.log(`User ${userId} joined the chat`);
    socket.join(userId);
  });

  socket.on('previous messages', async ({ userId1, userId2 }) => {
    try {
      const messages = await getPrivateMessage(userId1, userId2);
      socket.emit('previous messages', messages);
    } catch (err) {
      console.error(err);
    }
  })


  socket.on('send message', async ({ senderId, receiverId, message }) => {

    const newMessage = await saveMessage(senderId, receiverId, message);
    io.to(receiverId).emit('new message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err))

//Middleware
app.use(express.json({ limit: "4mb"}))
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("dev"))

//route middlewares
app.use("/api", authRoutes)

server.listen(8000, () => console.log("Server running on port 8000"))
