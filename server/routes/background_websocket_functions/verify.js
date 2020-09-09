const { User } = require("../../models/user");
const { Admin } = require("../../models/admin");
const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = process.env;

module.exports = async function verify(token) {
  if (token === "undefined" || token === "null") return [undefined, undefined];
  const { _id } = jwt.verify(token, jwtPrivateKey);
  if (!_id) return [undefined, undefined];
  let user = await User.findOne({ _id });
  let admin = await Admin.findOne({ _id });
  return [user, admin];
};
