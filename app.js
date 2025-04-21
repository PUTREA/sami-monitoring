const express = require("express");
const path = require("path");
const logger = require("morgan");
require("dotenv").config();


const indexRouter = require("./routes/index");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");


const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routing
app.use("/", indexRouter);
app.use("/api/test", indexRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error Handling
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

module.exports = app;
