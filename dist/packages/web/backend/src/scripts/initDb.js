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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const database_1 = __importDefault(require("../config/database"));
async function initializeDatabase() {
    try {
        console.log('Reading database schema...');
        const schemaPath = path.join(__dirname, '..', 'models', 'database.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log('Connecting to database...');
        const client = await database_1.default.connect();
        try {
            console.log('Executing schema...');
            await client.query(schema);
            console.log('Database schema initialized successfully!');
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
    finally {
        await database_1.default.end();
    }
}
// Check if we're running in production
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Running database initialization in ${isProduction ? 'production' : 'development'} mode`);
initializeDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});
