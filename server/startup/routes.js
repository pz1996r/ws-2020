const express = require("express");
const error = require("../middleware/error"); //spr
const users = require("../routes/users");
const auth = require("../routes/auth");
const codes = require("../routes/codes");

module.exports = function (app) {
  app.use(express.json());
  app.use(error);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/code", codes);
};
