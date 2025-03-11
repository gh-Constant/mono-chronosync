"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.initializeDatabase = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
// Log database connection attempt
console.log('=== Database Connection Debug ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);
console.log('SSL Enabled:', process.env.NODE_ENV === 'production');
// Database configuration
const isProduction = process.env.NODE_ENV === 'production';
// Connection configuration
const connectionConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    // For Docker internal connections, we need to disable SSL
    ssl: false
};
// Log full connection config (excluding sensitive data)
console.log('Connection Config:', {
    ...connectionConfig,
    password: '***HIDDEN***'
});
// Create a new pool instance
exports.pool = new pg_1.Pool(connectionConfig);
// Add error handler for connection issues
exports.pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
exports.pool.on('connect', () => {
    console.log('Successfully connected to database');
});
// Initialize database function
const initializeDatabase = async () => {
    try {
        console.log('Reading database schema...');
        const schemaPath = path.join(__dirname, '..', 'models', 'database.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log('Executing schema...');
        await exports.pool.query(schema);
        console.log('Database schema initialized successfully!');
        // Test the connection
        const result = await exports.pool.query('SELECT NOW()');
        console.log('Database time:', result.rows[0].now);
        return true;
    }
    catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
// Export the pool for use in other modules
exports.default = exports.pool;
// Helper function to execute queries
const query = (text, params) => {
    return exports.pool.query(text, params);
};
exports.query = query;
