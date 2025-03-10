"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
