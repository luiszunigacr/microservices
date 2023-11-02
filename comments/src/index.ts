import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

console.log("Init comments service");

import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";

const app = express();
app.use(bodyParser.json());

const commentsByPostId: CommentsByPost = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post(
  "/posts/:id/comments",
  (req: express.Request, res: express.Response) => {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content: content });

    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
  }
);

app.listen(4001, () => {
  console.log("Listening on 4001");
});
