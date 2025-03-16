"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rgpdMiddleware_1 = require("../middlewares/rgpdMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/rgpd/export
 * @desc    Export all user data (RGPD right to data portability)
 * @access  Private
 */
router.get('/export', authMiddleware_1.authenticate, rgpdMiddleware_1.dataExportMiddleware, (req, res) => {
    try {
        // In a real application, you would fetch all user data from the database
        // For this example, we'll just return a sample data structure
        // Get the user from the authenticated request
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Sample user data export
        const userData = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: new Date().toISOString(),
            },
            // Include all other user-related data
            tasks: [],
            preferences: {},
            activity: []
        };
        // Set headers for file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="user-data-${user.id}.json"`);
        // Send the data as a downloadable file
        return res.json(userData);
    }
    catch (error) {
        console.error('Error exporting user data:', error);
        return res.status(500).json({ message: 'Error exporting user data' });
    }
});
/**
 * @route   POST /api/rgpd/delete
 * @desc    Delete all user data (RGPD right to be forgotten)
 * @access  Private
 */
router.post('/delete', authMiddleware_1.authenticate, rgpdMiddleware_1.dataDeletionMiddleware, (req, res) => {
    try {
        // Get the user from the authenticated request
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // In a real application, you would delete all user data from the database
        // This would include:
        // 1. User account information
        // 2. User generated content
        // 3. User preferences
        // 4. User activity logs
        // 5. Any other data associated with the user
        // For this example, we'll just return a success message
        return res.json({
            message: 'User data deletion request received',
            details: 'Your data will be completely deleted within 30 days as per our data retention policy.'
        });
    }
    catch (error) {
        console.error('Error deleting user data:', error);
        return res.status(500).json({ message: 'Error processing data deletion request' });
    }
});
exports.default = router;
