import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import csrf from 'csrf';
import routes from './routes';
import { initializeDatabase } from './config/database';
import { configurePassport } from './config/passport';

export const createServer = async (): Promise<Application> => {
  const app = express();
  
  // Initialize database 
  try {
    await initializeDatabase();
    console.log('PostgreSQL database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize PostgreSQL database:', error);
    process.exit(1);
  }
  
  // Apply Helmet middleware for securing HTTP headers
  app.use(helmet({
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
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests, please try again later.',
  });
  
  // Apply rate limiting to all routes
  app.use(apiLimiter);
  
  // Setup more strict rate limits for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // 10 login attempts per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many login attempts, please try again later.',
  });
  
  // Will be applied to auth routes in the routes configuration
  
  // CORS middleware with more robust configuration
  app.use(cors({
    origin: function(origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
      const allowedOrigins = [
        'http://localhost:4173',
        'http://localhost:5173',
        'http://chronosync-frontend:80',
        'http://chronosync-frontend',
        'https://chronosync.constantsuchet.fr'
      ];
      
      console.log(`CORS Request from origin: ${origin || 'no origin'}`);
      
      // In development mode, allow all origins
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: allowing all origins for CORS');
        callback(null, true);
        return;
      }
      
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        console.log(`Origin ${origin || 'no origin'} allowed by CORS`);
        callback(null, true);
      } else {
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
  app.options('*', cors());
  
  // JSON Body parser middleware with validation
  app.use(express.json());
  
  // JSON validation middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.is('application/json') || !req.body) {
      return next();
    }
    
    try {
      // If we get here, express.json() middleware already parsed the body successfully
      next();
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON in request body' });
    }
  });

  // Initialize CSRF protection
  const tokens = new csrf();
  
  // Middleware for CSRF token validation
  app.use((req: Request, res: Response, next: NextFunction) => {
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
    if (tokens.verify(process.env.CSRF_SECRET || 'csrf-secret-key', csrfToken as string)) {
      next();
    } else {
      res.status(403).json({ message: 'Invalid CSRF token' });
    }
  });
  
  // Add CSRF token generation endpoint
  app.get('/api/csrf-token', (req: Request, res: Response) => {
    const token = tokens.create(process.env.CSRF_SECRET || 'csrf-secret-key');
    res.json({ csrfToken: token });
  });

  // Initialize and configure Passport
  app.use(passport.initialize());
  configurePassport();

  // Export auth rate limiter for use in route configuration
  app.locals.authLimiter = authLimiter;

  // Mount all routes under /api
  app.use('/api', routes);
  
  // Add simple test endpoint
  app.get('/test', (req: Request, res: Response) => {
    res.status(200).send('Server is running');
  });

  return app;
}; 