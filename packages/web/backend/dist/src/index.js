"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const port = Number(process.env.PORT) || 3000;
const app = (0, server_1.createServer)();
app.listen(port, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log(`Server started on http://0.0.0.0:${port}`);
    console.log(`Health check: http://0.0.0.0:${port}/api/health`);
    console.log('='.repeat(50));
});
