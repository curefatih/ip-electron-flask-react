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
exports.MessageManager = exports.serverReq = void 0;
var electron_1 = require("electron");
var fs = require("fs");
require('isomorphic-fetch');
exports.serverReq = function (path, data) {
    return fetch('http://127.0.0.1:5001' + path, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: data
    });
};
var image = "";
var imageSrc = "";
function MessageManager() {
    var _this = this;
    electron_1.ipcMain.on('openFile', function (event, arg) {
        imageSrc = arg;
        image = fs.readFileSync(arg).toString('base64');
        event.reply("openFile", image);
    });
    electron_1.ipcMain.on('rotate', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/rotate', JSON.stringify({
                        parameters: res.args,
                        img: res.image
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("rotate", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('swirl', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/swirl', JSON.stringify({
                        parameters: res.args,
                        img: res.image
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("swirl", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('hough_circle', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/hough_circle', JSON.stringify({
                        parameters: res.args,
                        img: res.image
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("hough_circle", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('integral_image', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/integral_image', JSON.stringify({
                        img: res.image
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("integral_image", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('downscale', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/downscale', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("downscale", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('eq_hist', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/eq_hist', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("eq_hist", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('gamma', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/gamma', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("gamma", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('equalize_adapthist', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/equalize_adapthist', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("equalize_adapthist", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('show_histogram', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/show_histogram', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("show_histogram", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('window', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/window', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("window", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('median', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/median', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("median", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('crop', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/crop', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("crop", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('resize', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/resize', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("resize", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('affine_transform', function (event, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.serverReq('/affine_transform', JSON.stringify({
                        img: res.image,
                        parameters: res.args
                    }))
                        .then(function (res) { return res.text(); })
                        .then(function (res) {
                        event.reply("affine_transform", res);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.MessageManager = MessageManager;
//# sourceMappingURL=message_manager.js.map