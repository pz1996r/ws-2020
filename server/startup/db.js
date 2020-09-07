const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function () {
  mongoose
    .connect(process.env.db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, //aditional https://mongoosejs.com/docs/deprecations.html
    })
    .then(() => console.log(`Connected to DB`))
    .catch((err) => console.error(err));
};
