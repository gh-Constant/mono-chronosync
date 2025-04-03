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
            console.log(`CORS Request from origin: ${origin || 'no origin'}`);
            // In production, Coolify deployment, or when ALLOW_ALL_ORIGINS is true, allow all origins
            if (process.env.NODE_ENV === 'production' || process.env.ALLOW_ALL_ORIGINS === 'true') {
                console.log('Production or ALLOW_ALL_ORIGINS mode: allowing all origins for CORS');
                callback(null, true);
                return;
            }
            // For development environment, use a whitelist approach
            const envAllowedOrigins = process.env.ALLOWED_ORIGINS ?
                process.env.ALLOWED_ORIGINS.split(',') : [];
            // Base allowed origins
            const allowedOrigins = [
                'http://localhost:4173',
                'http://localhost:5173',
                'http://chronosync-frontend:80',
                'http://chronosync-frontend',
                'http://app.chronosync.local',
                'http://localhost', // For local testing
                'https://app.chronosync.local',
                ...envAllowedOrigins // Dynamically add origins from environment variable
            ];
            // Extract hostname for wildcard matching
            const getFrontendHost = () => {
                // Parse the FRONTEND_URL if available
                if (process.env.FRONTEND_URL) {
                    try {
                        const url = new URL(process.env.FRONTEND_URL);
                        return url.hostname;
                    }
                    catch (e) {
                        console.warn('Invalid FRONTEND_URL format:', e);
                    }
                }
                return null;
            };
            const frontendHost = getFrontendHost();
            if (frontendHost && origin?.includes(frontendHost)) {
                console.log(`Allowing origin ${origin} that matches frontend host ${frontendHost}`);
                callback(null, true);
                return;
            }
            // Allow requests with no origin (like mobile apps, curl requests) or explicitly allowed origins
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                console.log(`Origin ${origin || 'no origin'} allowed by CORS`);
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
    // Add simple test endpoint at root for connectivity testing
    app.get('/', (req, res) => {
        res.status(200).json({
            message: 'Backend server is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            corsMode: process.env.ALLOW_ALL_ORIGINS === 'true' ? 'all origins allowed' : 'restricted origins'
        });
    });
    // Add error handling middleware
    app.use((err, req, res, next) => {
        console.error('Unhandled error:', err);
        res.status(500).json({
            message: 'An unexpected error occurred',
            error: process.env.NODE_ENV === 'production' ? undefined : err.message
        });
    });
    // 404 handler for undefined routes
    app.use((req, res) => {
        console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
        res.status(404).json({
            message: 'Route not found',
            path: req.originalUrl,
            availableRoutes: ['/api/health', '/api/auth/login', '/api/auth/register', '/']
        });
    });
    return app;
};
exports.createServer = createServer;
