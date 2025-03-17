"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./config/database");
const passport_2 = require("./config/passport");
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
        origin: function (origin, callback) {
            const allowedOrigins = [
                'http://localhost:4173',
                'http://localhost:5173',
                'https://chronosync.constantsuchet.fr'
            ];
            // Allow requests with no origin (like mobile apps, curl requests)
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                console.warn(`Origin ${origin} not allowed by CORS`);
                callback(null, false);
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        maxAge: 86400 // 24 hours
    }));
    // Ensure OPTIONS requests are handled properly
    app.options('*', (0, cors_1.default)());
    // Basic middleware
    app.use(express_1.default.json());
    // Initialize and configure Passport
    app.use(passport_1.default.initialize());
    (0, passport_2.configurePassport)();
    // Mount all routes under /api
    app.use('/api', routes_1.default);
    return app;
};
exports.createServer = createServer;
