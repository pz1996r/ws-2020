const fs = require("fs");
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/ws.develoopers.pl/privkey.pem"),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/ws.develoopers.pl/fullchain.pem"
  ),
};

module.exports = options;
