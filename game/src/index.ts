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
  getNameForZookeeper
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

//io.set('transports', ["websocket", "polling"]);

// app.use(function (req, res, next) {
//   console.log(req.url,req.query)
//   next()
// })

console.log('LAST IP SEGMENT: ',getNameForZookeeper());

connection.then(() => {
  console.log("Successfully connected to mongo");
});
// Register to zookeeper
registerToZookeeper().then((server_id: any) => {
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
      await changeLoadBalancingCounter(server_id,Object.keys(master.sessions).length);
      console.log("Registered");
    } catch (e) {
      disconnectSocketWithError(socket, e.message);
      console.log(e);
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

      if (isOver) await publishResult(server_id, playId, result);
    });
    socket.on(MESSAGE, (e: MessageEvent) =>
      io.to(playId).emit(MESSAGE, { message: e.message })
    );
    socket.on("disconnect", async () => {
      console.log("unregistering user...");
      master.unregisterUser(socket.id);
      socket.to(playId).emit(UPDATED_STATE, { event: "OP_DISCONNECTED" });
      try {
        
        await changeLoadBalancingCounter(server_id,Object.keys(master.sessions).length);
      } catch(e) {
        console.log(e);
      }
    });

    socket.on(READY, (e: MessageEvent) => {
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
      socket.to(playId).emit(UPDATED_STATE, { event: "OP_RECONNECTED" });
    });
  });

  server.listen(process.env.PORT, () => {
    console.log(`listening on *:${process.env.PORT}`);
  });
});
