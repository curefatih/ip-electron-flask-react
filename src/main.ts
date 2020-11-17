import { app, BrowserWindow, ipcMain } from 'electron';
import * as cp from 'child_process';
import config from './config';
import { MessageManager } from './message_manager';
import * as isDev from 'electron-is-dev'
const path = require('path')

/*************************************************************
 * py process
 *************************************************************/

// const PY_DIST_FOLDER = 'processor'
// const PY_FOLDER = 'pycalc'
// const PY_MODULE = 'api' // without .py suffix

// let pyProc: cp.ChildProcess = null
// let pyPort = config.PORT

// const guessPackaged = () => {
//   const fullPath = path.join(__dirname, PY_DIST_FOLDER)
//   return require('fs').existsSync(fullPath)
// }

// const getScriptPath = () => {
//   if (!guessPackaged()) {
//     return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
//   }
//   if (process.platform === 'win32') {
//     return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
//   }
//   return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
// }

// const createPyProc = () => {
//   let script = getScriptPath()
//   let port = '' + pyPort

//   if (guessPackaged()) {
//     pyProc = cp.execFile(script, [port])
//   } else {
//     pyProc = cp.spawn('python', [script, port])
//   }

//   if (pyProc != null) {
//     console.log('child process success on port ' + port)
//   }
// }

// const exitPyProc = () => {
//   pyProc.kill()
//   pyProc = null
//   pyPort = null
// }

// app.on('ready', createPyProc)
// app.on('will-quit', exitPyProc)


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
      : `file://${path.join(__dirname, "../front/index.html")}`
  );
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