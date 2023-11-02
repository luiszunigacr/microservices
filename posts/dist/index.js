"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const source_map_support_1 = __importDefault(require("source-map-support"));
source_map_support_1.default.install();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = require("crypto");
console.log("Initializing posts service");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const posts = new Map();
app.get("/posts", (req, res) => {
    console.log("get posts:", posts.values());
    res.send(Array.from(posts.values()));
});
app.post("/posts", (req, res) => {
    const id = (0, crypto_1.randomBytes)(4).toString("hex");
    const { title } = req.body;
    posts.set(id, {
        id: id,
        title: title,
    });
    res.status(201).send(posts.get(id));
});
app.listen(4000, () => {
    console.log("Listening on 4000");
});
//# sourceMappingURL=index.js.map