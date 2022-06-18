const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const dbConnect = require("./config/dbConnect.js");
const userRoutes = require("./routes/userRoutes");
const { ErrorResponse } = require("./utils/errorResponse");
const session = require("express-session");
const photoRoutes = require("./routes/photoRoutes.js");
// const mongoStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const path = require("path");

dbConnect();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    // origin: "http://localhost:3000",
    // credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//express session
// const store = mongoStore({
//   collection: "userCollection",
//   uri: process.env.MONGO_URI,
// });
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // store: store,
    cookie: {
      name: "userSession",
      sameSite: false,
      maxAge: 100 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);
app.use("/user", userRoutes);
app.use("/photos", photoRoutes);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("server is running");
  });
}

app.use(ErrorResponse);
// app.use((err, req, res, next) => {
//   res.status(err.statusCode).send(err.message);
//   //   next(err);
// });
app.listen(port, () => console.log("server is running on port " + port));
