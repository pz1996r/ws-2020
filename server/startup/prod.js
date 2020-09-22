const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors({ exposedHeaders: ["x-auth-token", "is-admin", "is-user"] }));
  app.use(helmet());
  app.use(compression());
};
