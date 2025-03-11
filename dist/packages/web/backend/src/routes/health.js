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
    const timeout = setTimeout(() => {
        res.status(503).json({
            status: 'unhealthy',
            error: 'Database query timeout after 5 seconds',
            timestamp: new Date().toISOString()
        });
    }, 5000);
    try {
        // Test basic connection first
        const client = await database_1.default.connect();
        try {
            const [devicesResult, usersResult, applicationsResult] = await Promise.all([
                client.query('SELECT COUNT(*) FROM devices'),
                client.query('SELECT COUNT(*) FROM users'),
                client.query('SELECT COUNT(*) FROM applications')
            ]);
            clearTimeout(timeout);
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                connection: {
                    host: process.env.DB_HOST,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT
                },
                counts: {
                    devices: parseInt(devicesResult.rows[0].count),
                    users: parseInt(usersResult.rows[0].count),
                    applications: parseInt(applicationsResult.rows[0].count)
                },
                message: 'Successfully connected to database and queried tables'
            });
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        clearTimeout(timeout);
        console.error('Database health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
            connection: {
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT
            },
            timestamp: new Date().toISOString()
        });
    }
});
exports.default = router;
