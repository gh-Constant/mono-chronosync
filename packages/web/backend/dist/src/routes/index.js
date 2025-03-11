"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/health', health_1.default);
// Import and use other route modules here
// router.use('/auth', require('./auth').default);
// router.use('/users', require('./users').default);
exports.default = router;
