"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});
router.get('/database', async (req, res) => {
    try {
        const [devicesResult, usersResult, applicationsResult] = await Promise.all([
            database_1.default.query('SELECT COUNT(*) FROM devices'),
            database_1.default.query('SELECT COUNT(*) FROM users'),
            database_1.default.query('SELECT COUNT(*) FROM applications')
        ]);
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            counts: {
                devices: parseInt(devicesResult.rows[0].count),
                users: parseInt(usersResult.rows[0].count),
                applications: parseInt(applicationsResult.rows[0].count)
            },
            message: 'Successfully connected to database and queried tables'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
});
exports.default = router;
