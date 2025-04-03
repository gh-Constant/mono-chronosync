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
exports.query = exports.initializeDatabase = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
// Log database connection attempt
console.log('=== PostgreSQL Database Connection Debug ===');
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
    ssl: false
};
// Create pool based on environment
const pool = isProduction
    ? new pg_1.Pool(connectionConfig)
    : new pg_1.Pool(connectionConfig);
// Initialize database function
const initializeDatabase = async () => {
    let client;
    try {
        console.log('Getting database connection...');
        client = await pool.connect();
        console.log('Testing database connection...');
        // Simple query to verify connection
        await client.query('SELECT NOW()');
        console.log('Database connection successful');
        // Check if we need to initialize the schema
        console.log('Checking if tables exist...');
        const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
        if (!tableCheck.rows[0].exists) {
            console.log('Tables do not exist, initializing schema from SQL file...');
            // If tables don't exist, run the initialization SQL script
            const schemaPath = path.join(__dirname, '..', 'models', 'database.sql');
            // Check if schema file exists
            if (!fs.existsSync(schemaPath)) {
                throw new Error(`Schema file not found at: ${schemaPath}`);
            }
            const schema = fs.readFileSync(schemaPath, 'utf8');
            await client.query(schema);
            console.log('Database schema initialized successfully!');
        }
        else {
            console.log('Database schema already exists');
        }
        console.log('PostgreSQL setup complete!');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw error;
    }
    finally {
        if (client)
            client.release();
    }
};
exports.initializeDatabase = initializeDatabase;
// Helper function to execute queries
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    }
    catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};
exports.query = query;
// Add error handler for connection issues
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
// Export pool for direct access if needed
exports.default = pool;
