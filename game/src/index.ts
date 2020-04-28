import dotenv from "dotenv";
import express from "express";
import http from "http";
import socketIo from "socket.io";
import {
  ID_COOKIE,
  TOKEN_COOKIE,
  CONNECTION_ERROR,
  MakeMoveEvent,
  MAKE_MOVE,
  MESSAGE,
  MessageEvent,
  DATA,
} from "./api/contract";
import PlayMaster from "./master/PlayMaster";
import { publishResult } from "./api/source";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(http);

const master = new PlayMaster();

app.get("/check", (req, res) => {
  res.send({
    valid: true,
  });
});

const disconnectSocketWithError = (
  socket: SocketIO.Socket,
  error = "An error happened during the handshake."
) => {
  socket.emit(CONNECTION_ERROR, {
    error,
  });
  socket.disconnect();
};

io.on("connection", (socket) => {
  const playId = socket.handshake.headers[ID_COOKIE];
  const userToken = socket.handshake.headers[TOKEN_COOKIE];

  if (!playId || !userToken) {
    disconnectSocketWithError(socket, "Missing credentials");
    return;
  }

  try {
    master.registerUser(socket.id, userToken, playId);
  } catch (e) {
    disconnectSocketWithError(socket, e.message);
    return;
  }

  socket.join(playId);

  socket.on(MAKE_MOVE, (e: MakeMoveEvent) => {
    const r = master.makeMove(socket.id, e.data, e.move);
    if (!r) return;

    const result = master.getResult(socket.id);
    const isOver = result !== "ongoing";
    io.to(playId).emit(DATA, {
      data: master.getData(socket.id),
      isOver,
    });

    if (isOver) publishResult(playId, result);
  });
  socket.on(MESSAGE, (e: MessageEvent) =>
    io.to(playId).send(MESSAGE, { message: e.message })
  );
  socket.on("disconnect", () => {
    master.unregisterUser(socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
