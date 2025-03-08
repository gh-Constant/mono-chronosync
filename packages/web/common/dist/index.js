"use strict";
// Common types and utilities for ChronoSync
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
exports.formatDate = formatDate;
// Example utility function
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
// Version info
exports.VERSION = '1.0.0';
