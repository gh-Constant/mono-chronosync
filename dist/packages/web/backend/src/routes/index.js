"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const auth_1 = __importDefault(require("./auth"));
const rgpd_1 = __importDefault(require("./rgpd"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/health', health_1.default);
router.use('/auth', auth_1.default);
router.use('/rgpd', rgpd_1.default);
// Import and use other route modules here
// router.use('/users', require('./users').default);
exports.default = router;
