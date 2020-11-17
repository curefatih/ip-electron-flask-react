"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var config_1 = require("./config");
var message_manager_1 = require("./message_manager");
var isDev = require("electron-is-dev");
var path = require('path');
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
    var win = new electron_1.BrowserWindow({
        minHeight: config_1["default"].MIN_HEIGHT,
        minWidth: config_1["default"].MIN_WIDTH,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        }
    });
    win.loadURL(isDev
        ? "http://localhost:3000"
        : "file://" + path.join(__dirname, "../front/index.html"));
    win.webContents.openDevTools();
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
message_manager_1.MessageManager();
//# sourceMappingURL=main.js.map