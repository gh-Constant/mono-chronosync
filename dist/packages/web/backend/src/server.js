"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const createServer = () => {
    const app = (0, express_1.default)();
    // Basic middleware
    app.use(express_1.default.json());
    // Mount all routes under /api
    app.use('/api', routes_1.default);
    return app;
};
exports.createServer = createServer;
