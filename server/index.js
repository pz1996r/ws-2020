const express = require("express");
// const https = require("https");
const app = express();
// const ssl = require("./utils/ssl");

// const httpsServer = https.createServer(ssl, app);
// require("express-ws")(app, httpsServer);
require("express-ws")(app);
require("./startup/prod")(app);
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/jwt")();

const port = process.env.PORT || 3000;
// const index = httpsServer.listen(port, () => {
//   console.log(`HTTPS Server running on port ${port}`);
// });

app.listen(port, () => {
  console.log(`
  Server running on port ${port}`);
});
