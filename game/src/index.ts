import express from "express";
import http from "http";
import socketIo from "socket.io";
import dotenv from "dotenv";
import { ID_COOKIE, TOKEN_COOKIE } from "./api/contract";
import { checkToken } from "./api/authenticate";
import { retrievePlay, retrievePlayProgress } from "./api/source";
import { PlayMaster } from "./PlayMaster";

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

io.use((socket, next) => {
  const playId = socket.handshake.headers[ID_COOKIE];
  const userToken = socket.handshake.headers[TOKEN_COOKIE];
  const user = checkToken(userToken);
  if (!user) return next(new Error("Invalid Token"));
  let play = playMaster.getPlay(playId);
  if (!play) {
    play = retrievePlay(playId);
    if (!play) return next(new Error("Invalid Play"));
    if (play.opponent1 !== user || play.opponent2 !== user)
      return next(new Error("User is not part of play"));
    const progress = retrievePlayProgress(playId);
    playMaster.registerPlay(play, progress);
  } else if (play.opponent1 !== user || play.opponent2 !== user)
    return next(new Error("User is not part of play"));

  socket.on("disconnect");

  return next();
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
