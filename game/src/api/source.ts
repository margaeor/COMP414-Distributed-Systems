import { Play, Result } from "./types";
import http from "http";
import connect from "../mongo/connect";
const { GameState } = require("../mongo/game_state");
import mongoose from "mongoose";

async function asyncGetRequest(
  host: string,
  path: string,
  port: number
): Promise<any> {
  return await new Promise((resolve, reject) => {
    http
      .get(
        {
          host: host,
          path: path,
          port: port,
        },
        function (resp) {
          resp.on("data", function (d) {
            try {
              let json = JSON.parse(d.toString("utf8"));
              if (json) resolve(json);
              else reject("Not a valid json response");
            } catch (e) {
              reject("Not a valid json response");
            }
          });
        }
      )
      .on("error", function (err) {
        reject(err);
      });
  });
}

export async function retrievePlay(
  server_id: string,
  id: string
): Promise<any> {
  try {
    let data = await asyncGetRequest(
      "api",
      "/playmaster/getinfo?id=" + server_id + "&game_id=" + id,
      3000
    );

    if (data.status == 200 && data.data) {
      data = data.data;
      return {
        id: data._id,
        opponent1: data.opponents[0],
        opponent2: data.opponents[1],
        game: data.game_type,
      };
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function publishResult(server_id:string, id: string, result: Result): Promise<any> {
  console.log(`play ${id} finished with status: ${result}`);

  try {
    let score = (result == "won") ? 1 : ((result == "draw")? 0 : -1);
    let data = await asyncGetRequest(
      "api", 
      "/playmaster/results?id=" + server_id + "&game_id=" + id+'&score='+score,
      3000
    );
    //console.log(data);
    //console.log("/playmaster/results?id=" + server_id + "&game_id=" + id+'&score='+score);
    if (data.status == 200 && data.data) {
      return true;
    } return false;
  } catch (e) {
    console.log(e);
    return false;
  }

}

export async function restoreProgress(id: string): Promise<string | null> {
  //@TODO remove placeholder
  try {
    let game = await GameState.findById(id).exec();

    if (game) {
      console.log("RETURNING " + game.position);
      return game.position;
    } else return null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function backupProgress(
  id: string,
  progress: string
): Promise<any> {
  try {
    let game = await GameState.findOneAndUpdate(
      { _id: id },
      { position: progress },
      { new: true, upsert: true }
    ).exec();
    if (game) {
      console.log("Game saved ", game);
      return true;
    } else return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
