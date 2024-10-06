"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipcping = exports.initIPC = void 0;
var initIPC_1 = require("./initIPC");
Object.defineProperty(exports, "initIPC", { enumerable: true, get: function () { return initIPC_1.initIPC; } });
var ipcping_1 = require("./ipcping");
Object.defineProperty(exports, "ipcping", { enumerable: true, get: function () { return __importDefault(ipcping_1).default; } });
