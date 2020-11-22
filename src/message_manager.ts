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
        event.reply("err", err.message);
      })

  })

  ipcMain.on('saveFile', (event, img) => {
    let base64Data = img.replace(/^data:image\/png;base64,/, "");
    require("fs").writeFile("out.png", base64Data, 'base64', function (err: Error) {
      if (err)
        event.reply('error', err.message)

      event.reply('saveFile', 'Görüntü etkin dizine "out.png" adında kaydedildi.')
    });
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
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
        event.reply("err", err.message);
      })

  })

  ipcMain.on('resize', async (event, res) => {

    await serverReq('/resize', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("resize", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('affine_transform', async (event, res) => {

    await serverReq('/affine_transform', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("affine_transform", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('sato', async (event, res) => {

    await serverReq('/sato', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("sato", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('sobel', async (event, res) => {

    await serverReq('/sobel', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("sobel", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('prewitt', async (event, res) => {

    await serverReq('/prewitt', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("prewitt", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('laplace', async (event, res) => {

    await serverReq('/laplace', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("laplace", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('unsharp_mask', async (event, res) => {

    await serverReq('/unsharp_mask', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("unsharp_mask", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('meijering', async (event, res) => {

    await serverReq('/meijering', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("meijering", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('scharr', async (event, res) => {

    await serverReq('/scharr', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("scharr", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('hysteresis_threshold', async (event, res) => {

    await serverReq('/hysteresis_threshold', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("hysteresis_threshold", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('erosion', async (event, res) => {

    await serverReq('/erosion', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("erosion", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('dilation', async (event, res) => {

    await serverReq('/dilation', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("dilation", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('opening', async (event, res) => {

    await serverReq('/opening', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("opening", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('skeletonize', async (event, res) => {

    await serverReq('/skeletonize', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("skeletonize", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('convex_hull', async (event, res) => {

    await serverReq('/convex_hull', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("convex_hull", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })
  
  ipcMain.on('closing', async (event, res) => {

    await serverReq('/closing', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("closing", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })
  
  ipcMain.on('white_tophat', async (event, res) => {

    await serverReq('/white_tophat', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("white_tophat", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('black_tophat', async (event, res) => {

    await serverReq('/black_tophat', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("black_tophat", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('thin', async (event, res) => {

    await serverReq('/thin', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("thin", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })
  
  ipcMain.on('medial_axis', async (event, res) => {

    await serverReq('/medial_axis', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("medial_axis", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })

  ipcMain.on('active_contour', async (event, res) => {

    await serverReq('/active_contour', JSON.stringify({
      img: res.image,
      parameters: res.args,
    }))
      .then(res => res.text())
      .then(res => {
        event.reply("active_contour", res);
      })
      .catch(err => {
        event.reply("err", err.message);
      })

  })
}