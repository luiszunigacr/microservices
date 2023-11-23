"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const source_map_support_1 = __importDefault(require("source-map-support"));
source_map_support_1.default.install();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = require("crypto");
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
console.log("Initializing posts service");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const posts = new Map();
app.get("/posts", (req, res) => {
    console.log("get posts:", posts.values());
    res.send(Array.from(posts.values()));
});
app.post("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, crypto_1.randomBytes)(4).toString("hex");
    const { title } = req.body;
    posts.set(id, {
        id: id,
        title: title,
    });
    console.log('sending event "PostCreated"');
    yield axios_1.default
        .post("http://localhost:4005/events", {
        type: "PostCreated",
        data: {
            id,
            title,
        },
    })
        .catch((err) => {
        console.error(err);
    });
    res.status(201).send(posts.get(id));
}));
app.post("/events", (req, res) => {
    console.log("Event received", req.body.type);
    res.send({});
});
app.listen(4000, () => {
    console.log("Listening on 4000");
});
//# sourceMappingURL=index.js.map