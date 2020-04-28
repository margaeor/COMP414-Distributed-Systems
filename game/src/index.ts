import dotenv from "dotenv";
import express from "express";
import http from "http";
import socketIo from "socket.io";
import { ID_COOKIE, TOKEN_COOKIE } from "./api/contract";
import PlayMaster from "./master/PlayMaster";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(http);

const playMaster = new PlayMaster();

app.get("/check", (req, res) => {
  res.send({
    valid: true,
  });
});

io.on("connection", (socket) => {
  const playId = socket.handshake.headers[ID_COOKIE];
  const userToken = socket.handshake.headers[TOKEN_COOKIE];

  if (!playId || !userToken) return next(new Error("Missing credentials"));

  try {
    playMaster.registerUser(socket.id, userToken, playId);
  } catch (e) {
    return next(e);
  }

  socket.roo;

  return next();
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
