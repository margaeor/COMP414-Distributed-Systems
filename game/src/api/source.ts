import { Play, Result } from "./types";
import http from "http";
import connect from "../mongo/connect";
const {GameState} = require("../mongo/game_state");
import mongoose from "mongoose";

async function asyncGetRequest(host: string, path: string, port: number): Promise<any> {

  return await (new Promise((resolve, reject) => { 
    http.get({
      host: host, 
      path: path,
      port: port
    }, function(resp){
        resp.on('data', function(d){
          try {
            let json = JSON.parse(d.toString('utf8'));
            if(json) resolve(json);
            else reject('Not a valid json response');
          } catch(e){
            reject('Not a valid json response');
          }
        })
    }).on('error', function(err){
        reject(err);
    })
  }));
}

export async function retrievePlay(server_id:string, id: string): Promise<any> {

  // @TODO remove placeholder and return null on error
  let placeholder = {
    id,
    opponent1: "killX22",
    opponent2: "vetIO",
    game: "chess",
  };

  try {

    let data = await asyncGetRequest('api','/playmaster/getinfo?id='+server_id+'&game_id='+id,3000);

    if(data.status == 200 && data.data) {
      data = data.data;
      return {
        id: data._id,
        opponent1: data.opponents[0],
        opponent2: data.opponents[1],
        game: data.game_type,
      };
    } else {
      return placeholder;
    }

  } catch(e){
    console.log(e);
    return placeholder;
  }
  
}


export function publishResult(id: string, result: Result): void {
  console.log(`play ${id} finished with status: ${result}`);
}


export async function restoreProgress(id: string) : Promise<string> {
  var placeholder = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1;";
  //@TODO remove placeholder
  try {

    let game = await GameState.findById(id).exec();

    if(game){

      console.log("RETURNING "+game.position);
      return game.position;

    } else return placeholder;

} catch(e) {
    console.log(e);
    return placeholder;
  }
}

export async function backupProgress(id: string, progress: string): Promise<any> {
  try {

    let game = await GameState.findOneAndUpdate({_id:id},{position:progress},{new:true,upsert:true}).exec();
    if(game) {
      console.log('Game saved ',game);
      return true;
    } else return false;
  } catch(e) {
    console.log(e);
    return false;
  }
}