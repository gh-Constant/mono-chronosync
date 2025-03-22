"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const csrf_1 = __importDefault(require("csrf"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./config/database");
const passport_2 = require("./config/passport");
const rgpdMiddleware_1 = require("./middlewares/rgpdMiddleware");
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
    // Apply Helmet middleware for securing HTTP headers
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'"],
            },
        },
        crossOriginEmbedderPolicy: false, // For compatibility with OAuth redirects
    }));
    // Configure rate limiting
    const apiLimiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per window
        standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'Too many requests, please try again later.',
    });
    // Apply rate limiting to all routes
    app.use(apiLimiter);
    // Setup more strict rate limits for auth endpoints
    const authLimiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 60 * 60 * 1000, // 1 hour
        limit: 10, // 10 login attempts per hour
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: 'Too many login attempts, please try again later.',
    });
    // Will be applied to auth routes in the routes configuration
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
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With', 'CSRF-Token'],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'CSRF-Token'],
        credentials: true,
        maxAge: 86400 // 24 hours
    }));
    // Ensure OPTIONS requests are handled properly
    app.options('*', (0, cors_1.default)());
    // JSON Body parser middleware with validation
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)()); // Add cookie parser middleware
    // Apply RGPD middleware
    app.use(rgpdMiddleware_1.rgpdMiddleware);
    // JSON validation middleware
    app.use((req, res, next) => {
        if (!req.is('application/json') || !req.body) {
            return next();
        }
        try {
            // If we get here, express.json() middleware already parsed the body successfully
            next();
        }
        catch (e) {
            return res.status(400).json({ message: 'Invalid JSON in request body' });
        }
    });
    // Initialize CSRF protection
    const tokens = new csrf_1.default();
    // Middleware for CSRF token validation
    app.use((req, res, next) => {
        // Skip CSRF protection for non-mutating methods
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
            return next();
        }
        // Skip CSRF for OAuth callback routes and API endpoints with JWT auth
        if (req.path.startsWith('/api/auth/') || req.path.includes('/oauth/callback')) {
            return next();
        }
        const csrfToken = req.headers['csrf-token'] || req.headers['x-csrf-token'];
        // Client doesn't have a token yet
        if (!csrfToken) {
            // Generate a new token
            const newToken = tokens.create(process.env.CSRF_SECRET || 'csrf-secret-key');
            res.setHeader('CSRF-Token', newToken);
            return next();
        }
        // Validate the token
        if (tokens.verify(process.env.CSRF_SECRET || 'csrf-secret-key', csrfToken)) {
            next();
        }
        else {
            res.status(403).json({ message: 'Invalid CSRF token' });
        }
    });
    // Add CSRF token generation endpoint
    app.get('/api/csrf-token', (req, res) => {
        const token = tokens.create(process.env.CSRF_SECRET || 'csrf-secret-key');
        res.json({ csrfToken: token });
    });
    // Initialize and configure Passport
    app.use(passport_1.default.initialize());
    (0, passport_2.configurePassport)();
    // Export auth rate limiter for use in route configuration
    app.locals.authLimiter = authLimiter;
    // Mount all routes under /api
    app.use('/api', routes_1.default);
    // Add health check endpoint
    app.get('/api/health', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    return app;
};
exports.createServer = createServer;
