const express = require("express");
const app = express();
const cors = require("cors");
// require("dotenv").config();

// START: FOR NODE VPS:
const https = require("https");
const fs = require("fs");
// END: FOR NODE VPS:

app.use(cors({ exposedHeaders: ["x-auth-token"] }));
require("./startup/prod")(app);
require("./startup/db")();
require("./startup/routes")(app);

app.use(express.json());
if (!process.env.jwtPrivateKey) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("Hello world ...");
});
app.get("/background", (req, res) => {
  res.send("Hello world");
});

const port = process.env.PORT || 443;
// START: FOR THE  VPS
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/ws.develoopers.pl/privkey.pem"),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/ws.develoopers.pl/fullchain.pem"
  ),
};
const httpsServer = https.createServer(options, app);
require("express-ws")(app, httpsServer);
require("./startup/backgroundWebsocket")(app);
require("./startup/websocket")(app);
const index = httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});
// END: FOR THE VPS
module.exports = index;
