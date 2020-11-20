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

  ipcMain.on('hough_circle', async (event, res) => {

    await serverReq('/hough_circle', JSON.stringify({
      parameters: res.args,
      img: res.image
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("hough_circle", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('integral_image', async (event, res) => {

    await serverReq('/integral_image', JSON.stringify({
      img: res.image
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("integral_image", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('downscale', async (event, res) => {

    await serverReq('/downscale', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("downscale", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('eq_hist', async (event, res) => {

    await serverReq('/eq_hist', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("eq_hist", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('gamma', async (event, res) => {

    await serverReq('/gamma', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("gamma", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('equalize_adapthist', async (event, res) => {

    await serverReq('/equalize_adapthist', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("equalize_adapthist", res);
      })
      .catch(err => {
        console.log(err);
      })

  })
  
  ipcMain.on('show_histogram', async (event, res) => {

    await serverReq('/show_histogram', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("show_histogram", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('window', async (event, res) => {

    await serverReq('/window', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("window", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('median', async (event, res) => {

    await serverReq('/median', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("median", res);
      })
      .catch(err => {
        console.log(err);
      })

  })

  ipcMain.on('crop', async (event, res) => {

    await serverReq('/crop', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("crop", res);
      })
      .catch(err => {
        console.log(err);
      })

  })
}