const Joi = require("joi");
const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5,
    unique: true,
  },
});

const Code = mongoose.model("Code", codeSchema);

function validateCode(code) {
  const schema = Joi.object({
    code: Joi.string().min(5).max(5).required(),
  });
  return schema.validate(code);
}

exports.Code = Code;
exports.validate = validateCode;
