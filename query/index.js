const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === "CommentCreated") {
    const { id, postId, content, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  } else if (type === "CommentUpdated") {
    const { id, postId, content, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Event received", type);

  handleEvent(type, data);

  console.log("Posts:", posts);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on port 4002");
  const res = await axios
    .get("http://event-bus-srv:4005/events")
    .catch((err) => {
      console.error(err);
    });

  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data);
  }
});
