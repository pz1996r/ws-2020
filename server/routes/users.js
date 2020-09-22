const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const { Code } = require("../models/code");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ data: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  let name = await User.findOne({ name: req.body.name });
  let code = await Code.findOne({ code: req.body.code });
  if (user)
    return res
      .status(400)
      .send({ data: "User with this email already registered" });
  if (name)
    return res
      .status(400)
      .send({ data: "User with this name already registered" });
  if (!code) return res.status(400).send({ data: "Incorrect register code" });
  Code.findOneAndRemove({ code: req.body.code }, function (err) {});

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send({ data: _.pick(user, ["_id", "name", "email"]) });
});

router.get("/", async (req, res) => {
  const users = await User.find().select(" name email -_id");
  return res.send(users);
});

module.exports = router;
