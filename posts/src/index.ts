import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";

console.log("Initializing posts service");

const app = express();
app.use(bodyParser.json());

const posts: Map<string, { id?: string; title?: string }> = new Map();

app.get("/posts", (req, res) => {
  console.log("get posts:", posts.values());
  res.send(Array.from(posts.values()));
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
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
