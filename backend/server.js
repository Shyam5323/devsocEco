require("dotenv").config();
require("express-async-errors");



const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const userRoutes = require("./routes/userRoutes");
const recommendRoutes = require("./routes/bestPractices.js");
const emissionRouter = require("./routes/emission.js");
const categoryRoutes = require("./routes/categoryRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const leaderboardRoutes = require("./routes/leaderboard");

const connectDb = require("./db/connect");

app.use(helmet());
app.use(cors({ origin: "http://localhost:5000", credentials: true }));
app.use(xss());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/emission", emissionRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/recommendation", recommendRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);

app.use("/api/v1/leaderboard", leaderboardRoutes);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
