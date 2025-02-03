require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const connectDb = require("./db/connect");

const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/user.js");
const emissionRouter = require("./routes/emission.js");

const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/emission", emissionRouter);
app.use("/api/v1/user", userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

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
