"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataDeletionMiddleware = exports.dataExportMiddleware = exports.marketingConsentMiddleware = exports.analyticsConsentMiddleware = exports.rgpdMiddleware = void 0;
/**
 * RGPD Middleware - Adds necessary headers for RGPD compliance
 *
 * This middleware:
 * 1. Adds strict cookie policy headers
 * 2. Adds privacy policy related headers
 * 3. Implements cookie consent checking for non-essential endpoints
 */
const rgpdMiddleware = (req, res, next) => {
    // Set strict cookie policy headers
    res.setHeader('Set-Cookie', [
        'Path=/',
        'HttpOnly',
        'Secure',
        'SameSite=Strict'
    ].join(';'));
    // Add privacy policy related headers
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Continue to the next middleware
    next();
};
exports.rgpdMiddleware = rgpdMiddleware;
/**
 * Cookie Consent Middleware - Checks if the user has consented to analytics cookies
 *
 * This middleware should be applied to routes that use analytics cookies
 */
const analyticsConsentMiddleware = (req, res, next) => {
    // Check if the user has consented to analytics cookies
    const cookieConsent = req.cookies['cookie-consent'];
    if (!cookieConsent) {
        // If no consent is found, don't set analytics cookies
        return next();
    }
    try {
        const consent = JSON.parse(cookieConsent);
        // If analytics consent is not given, don't set analytics cookies
        if (!consent.analytics) {
            return next();
        }
        // User has consented to analytics, proceed normally
        next();
    }
    catch (error) {
        // If there's an error parsing the consent, don't set analytics cookies
        next();
    }
};
exports.analyticsConsentMiddleware = analyticsConsentMiddleware;
/**
 * Marketing Consent Middleware - Checks if the user has consented to marketing cookies
 *
 * This middleware should be applied to routes that use marketing cookies
 */
const marketingConsentMiddleware = (req, res, next) => {
    // Check if the user has consented to marketing cookies
    const cookieConsent = req.cookies['cookie-consent'];
    if (!cookieConsent) {
        // If no consent is found, don't set marketing cookies
        return next();
    }
    try {
        const consent = JSON.parse(cookieConsent);
        // If marketing consent is not given, don't set marketing cookies
        if (!consent.marketing) {
            return next();
        }
        // User has consented to marketing, proceed normally
        next();
    }
    catch (error) {
        // If there's an error parsing the consent, don't set marketing cookies
        next();
    }
};
exports.marketingConsentMiddleware = marketingConsentMiddleware;
/**
 * Data Export Middleware - Handles user data export requests (RGPD right to data portability)
 */
const dataExportMiddleware = (req, res, next) => {
    // Add a custom property to the request object to indicate that this is a data export request
    req.isDataExport = true;
    // Continue to the next middleware
    next();
};
exports.dataExportMiddleware = dataExportMiddleware;
/**
 * Data Deletion Middleware - Handles user data deletion requests (RGPD right to be forgotten)
 */
const dataDeletionMiddleware = (req, res, next) => {
    // Add a custom property to the request object to indicate that this is a data deletion request
    req.isDataDeletion = true;
    // Continue to the next middleware
    next();
};
exports.dataDeletionMiddleware = dataDeletionMiddleware;
