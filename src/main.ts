import { app, BrowserWindow, ipcMain } from 'electron';
import * as cp from 'child_process';
import config from './config';
import { MessageManager, serverReq } from './message_manager';
import * as isDev from 'electron-is-dev'
const path = require('path')

/*************************************************************
 * py process
 *************************************************************/

if (!isDev) {
  let pyProc: cp.ChildProcess = null
  let pyPort = config.PORT

  const createPyProc = () => {
    let script = path.join(__dirname, "../api/app.py")
    let port = '' + pyPort

    pyProc = cp.spawn('python', [script])

    if (pyProc != null) {
      console.log('child process success on port ' + port)
    }

  }

  const exitPyProc = () => {
    // @ts-expect-error
    pyProc.stdin.pause();
    pyProc.kill()
    pyProc = null
    pyPort = null
  }

  app.on('ready', createPyProc)
  app.on('before-quit', async function () {
    console.log("quiting");

    await serverReq('/shutdown', {})
      .then(res => res.text())
      .then(res => {
        console.log("q", res);
      })
      .catch(err => {
        console.log(err);
      })
    exitPyProc()
  });
}

/*************************************************************
 * electron process
 *************************************************************/
function createWindow() {
  const win = new BrowserWindow({
    minHeight: config.MIN_HEIGHT,
    minWidth: config.MIN_WIDTH,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + '/preload.js'
    }
  })

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../front/build/index.html")}`
  );
  if (isDev)
    win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

MessageManager()