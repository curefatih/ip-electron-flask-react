"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
var cp = require("child_process");
var config_1 = require("./config");
var message_manager_1 = require("./message_manager");
var isDev = require("electron-is-dev");
var path = require('path');
/*************************************************************
 * py process
 *************************************************************/
if (!isDev) {
    var pyProc_1 = null;
    var pyPort_1 = config_1["default"].PORT;
    var createPyProc = function () {
        var script = path.join(__dirname, "../api/app.py");
        var port = '' + pyPort_1;
        pyProc_1 = cp.spawn('python', [script]);
        if (pyProc_1 != null) {
            console.log('child process success on port ' + port);
        }
    };
    var exitPyProc_1 = function () {
        // @ts-expect-error
        pyProc_1.stdin.pause();
        pyProc_1.kill();
        pyProc_1 = null;
        pyPort_1 = null;
    };
    electron_1.app.on('ready', createPyProc);
    electron_1.app.on('before-quit', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("quiting");
                        return [4 /*yield*/, message_manager_1.serverReq('/shutdown', {})
                                .then(function (res) { return res.text(); })
                                .then(function (res) {
                                console.log("q", res);
                            })["catch"](function (err) {
                                console.log(err);
                            })];
                    case 1:
                        _a.sent();
                        exitPyProc_1();
                        return [2 /*return*/];
                }
            });
        });
    });
}
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
        : "file://" + path.join(__dirname, "../front/build/index.html"));
    if (isDev)
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