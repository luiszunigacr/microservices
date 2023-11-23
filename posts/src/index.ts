import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

console.log("Initializing posts service");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts: Map<string, { id?: string; title?: string }> = new Map();

app.get("/posts", (req, res) => {
  console.log("get posts:", posts.values());
  res.send(Array.from(posts.values()));
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts.set(id, {
    id: id,
    title: title,
  });

  console.log('sending event "PostCreated"');
  await axios
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
});

app.post("/events", (req, res) => {
  console.log("Event received", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
