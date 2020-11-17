import { ipcMain } from "electron"
import * as fs from 'fs'
require('isomorphic-fetch');

export const serverReq = (path: string, data: any) => {
  return fetch('http://127.0.0.1:5001' + path,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: data
    }
  )
}

let image = "";
let imageSrc = "";
export function MessageManager() {
  ipcMain.on('openFile', (event, arg) => {
    imageSrc = arg
    image = fs.readFileSync(arg).toString('base64');
    event.reply("openFile", image);
  })

  ipcMain.on('rotate', async (event, res) => {
    await serverReq('/rotate', JSON.stringify({
      parameters: res.args,
      img: res.image
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("rotate", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('swirl', async (event, res) => {

    await serverReq('/swirl', JSON.stringify({
      parameters: res.args,
      img: res.image
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("swirl", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

}