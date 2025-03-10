"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/health', (_, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
// Import and use other route modules here
// router.use('/auth', require('./auth').default);
// router.use('/users', require('./users').default);
exports.default = router;
