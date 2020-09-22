const Joi = require("joi");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User } = require("../models/user");
const { Admin } = require("../models/admin");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ data: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  let admin = await Admin.findOne({ email: req.body.email });
  if (!user && !admin) {
    return res.status(400).send({ data: "Invalid email or password." });
  }
  let validPassword;
  if (user) {
    validPassword = await bcrypt.compare(req.body.password, user.password);
  } else {
    validPassword = await bcrypt.compare(req.body.password, admin.password);
  }

  if (!validPassword) {
    return res.status(400).send({ data: "Invalid email or password." });
  }

  const token = user ? user.generateAuthToken() : admin.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header(`is-${!user ? "admin" : "user"}`, !user)
    .send({ data: "logged in" });
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

module.exports = router;
