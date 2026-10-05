const express = require("express");
const postRouter = require("./routes/postRouter");
const authRouter = require("./routes/authRouter");
const commentRouter = require("./routes/commentRouter");
const errorHandler = require("./controllers/errorController");
const app = express();

const cors = require("cors");

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors());

app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts/:postId/comments", commentRouter);
app.use('/posts', postRouter);

app.use((req, res, next) =>{
    res.status(404).send("Page not found!");
});

app.use(errorHandler);


const PORT = 8080;
app.listen(PORT, (err) =>{
    if(err)throw err;
    console.log("Express listening on port: 8080!");
});