const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin");
const { Code, validate } = require("../models/code");
const express = require("express");
const router = express.Router();

const { jwtPrivateKey } = process.env;

router.post("/", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({ data: "Access denied. No token provided." });
  const { _id } = jwt.verify(token, jwtPrivateKey);
  if (!_id) return res.status(401).send({ data: "Invalid token." });
  const admin = await Admin.findOne({ _id });
  if (!admin) return res.status(401).send({ data: "Invalid token." });
  // walidacja i tworzenie kodu:
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ data: error.details[0].message });
  let code = await Code.findOne({ code: req.body.code });
  if (code) return res.status(400).send({ data: "This code already exist." });

  code = new Code(_.pick(req.body, ["code"]));
  await code.save();
  res.send(_.pick(code, ["_id", "code"]));
});

module.exports = router;
