"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./config/database");
const createServer = async () => {
    const app = (0, express_1.default)();
    // Initialize database 
    try {
        await (0, database_1.initializeDatabase)();
        console.log('PostgreSQL database initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize PostgreSQL database:', error);
        process.exit(1);
    }
    // CORS middleware with more robust configuration
    app.use((0, cors_1.default)({
        origin: [
            'http://localhost:4173',
            'http://localhost:5173',
            'https://chronosync.constantsuchet.fr',
            'https://api.chronosync.constantsuchet.fr'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        maxAge: 86400 // 24 hours
    }));
    // Add preflight handling for OPTIONS requests
    app.options('*', (0, cors_1.default)());
    // Basic middleware
    app.use(express_1.default.json());
    // Mount all routes under /api
    app.use('/api', routes_1.default);
    return app;
};
exports.createServer = createServer;
