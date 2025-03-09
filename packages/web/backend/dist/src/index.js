"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const port = process.env.PORT || 3005;
const app = (0, server_1.createServer)();
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
