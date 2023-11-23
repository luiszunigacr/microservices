import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

console.log("Init comments service");

import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId: CommentsByPost = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post(
  "/posts/:id/comments",
  async (req: express.Request, res: express.Response) => {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    const comment: PostComment = {
      id: commentId,
      content,
      status: "pending",
    };
    comments.push(comment);

    commentsByPostId[req.params.id] = comments;

    console.log('sending event "CommentCreated" v2');
    await axios
      .post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: {
          ...comment,
          postId: req.params.id,
        },
      })
      .catch((err) => {
        console.error(err);
      });

    res.status(201).send(comments);
  }
);

app.post("/events", async (req, res) => {
  console.log("Event received", req.body.type);
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, postId, content, status } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id === id);
    if (comment) {
      comment.status = status;

      await axios
        .post("http://localhost:4005/events", {
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
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
