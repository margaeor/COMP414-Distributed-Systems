import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import socketIo from "socket.io";
import ip from "ip";
import connection from "./mongo/connect.js";

// @ts-ignore
import {
  registerToZookeeper,
  changeLoadBalancingCounter,
} from "./zookeeper/functions";
import {
  CONNECTION_ERROR,
  DATA,
  ID_COOKIE,
  MakeMoveEvent,
  MAKE_MOVE,
  MESSAGE,
  MessageEvent,
  TOKEN_COOKIE,
  UPDATED_STATE,
  UpdatedStateEvent,
  READY,
  DataEvent,
} from "./api/contract";
import { publishResult } from "./api/source";
import PlayMaster from "./master/PlayMaster";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//var server_id: String;

connection.then(() => {
  console.log("Successfully connected to mongo");
});
// Register to zookeeper
registerToZookeeper(ip.address()).then((server_id: any) => {
  const master = new PlayMaster(server_id);

  app.use(cors());
  app.get("/check", (req, res) => {
    res.send({
      valid: true,
    });
    console.log("served check");
  });

  const disconnectSocketWithError = (
    socket: SocketIO.Socket,
    error = "An error happened during the handshake."
  ) => {
    socket.emit(CONNECTION_ERROR, {
      error,
    });
    console.log(error);
    socket.disconnect();
  };

  io.on("connection", async (socket) => {
    const playId = socket.handshake.headers[ID_COOKIE];
    const userToken = socket.handshake.headers[TOKEN_COOKIE];

    console.log(`player with token: ${userToken} connected`);

    if (!playId || !userToken) {
      disconnectSocketWithError(socket, "Missing credentials");
      return;
    }
    console.log(playId);

    try {
      await master.registerUser(socket.id, userToken, playId);
      console.log("Registered");
    } catch (e) {
      disconnectSocketWithError(socket, e.message);
      return;
    }

    socket.join(playId);

    socket.on(MAKE_MOVE, async (e: MakeMoveEvent) => {
      console.log("received move");
      console.log(e);
      const r = await master.makeMove(socket.id, e.data, e.move);
      console.log("processed move: " + r);
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
      io.to(playId).emit(MESSAGE, { message: e.message })
    );
    socket.on("disconnect", () => {
      console.log("unregistering user...");
      master.unregisterUser(socket.id);
      socket.to(playId).emit(UPDATED_STATE, { event: "OP_DISCONNECTED" });
    });

    socket.on(READY, (e: MessageEvent) => {
      socket.to(playId).emit(UPDATED_STATE, { event: "OP_RECONNECTED" });
      if (master.arePlayersReady(socket.id)) {
        io.to(playId).emit(READY);
        io.to(playId).emit(DATA, {
          data: master.getData(socket.id),
          isOver: false,
        } as DataEvent);
        console.log("ready");
      } else {
        console.log("not ready");
      }
    });
  });

  server.listen(process.env.PORT, () => {
    console.log(`listening on *:${process.env.PORT}`);
  });
});
