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
console.log("Init comments service");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = require("crypto");
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const commentsByPostId = {};
app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});
app.post("/posts/:id/comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = (0, crypto_1.randomBytes)(4).toString("hex");
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    const comment = {
        id: commentId,
        content,
        status: "pending",
    };
    comments.push(comment);
    commentsByPostId[req.params.id] = comments;
    console.log('sending event "CommentCreated" v2');
    yield axios_1.default
        .post("http://event-bus-srv:4005/events", {
        type: "CommentCreated",
        data: Object.assign(Object.assign({}, comment), { postId: req.params.id }),
    })
        .catch((err) => {
        console.error(err);
    });
    res.status(201).send(comments);
}));
app.post("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Event received", req.body.type);
    const { type, data } = req.body;
    if (type === "CommentModerated") {
        const { id, postId, content, status } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find((comment) => comment.id === id);
        if (comment) {
            comment.status = status;
            yield axios_1.default
                .post("http://event-bus-srv:4005/events", {
                type: "CommentUpdated",
                data: {
                    id,
                    postId,
                    content,
                    status,
                },
            })
                .catch((err) => {
                console.error(err);
            });
        }
    }
    res.send({});
}));
app.listen(4001, () => {
    console.log("Listening on 4001");
});
