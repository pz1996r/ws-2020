const express = require("express");
const router = express.Router();
const { USERS } = require("./websocket_functions/globalParams");

const handleAddTime = require("./websocket_functions/handleAddTime");
const handleSubtractTime = require("./websocket_functions/handleSubtractTime");
const handleSetTimer = require("./websocket_functions/handleSetTimer");
const handleUserJoin = require("./websocket_functions/handleUserJoin");
const handleUserLeave = require("./websocket_functions/handleUserLeave");

router.get("/", (req, res) => {
  res.send("Server is working, you can connect with websocket");
});

router.ws("/", (ws, req) => {
  const userAgent = req["headers"]["user-agent"];
  const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  USERS.set(ws, { withoutRoom: true });

  ws.on("close", () => handleUserLeave(ws));
  ws.on("message", (message) => {
    const { payload, data } = JSON.parse(message);
    switch (payload) {
      case "JOIN_ROOM":
        ws.send(handleUserJoin(data, userIP, ws, userAgent));
        break;
      case "SET_TIMER":
        ws.send(handleSetTimer(data, ws));
        break;
      case "ADD_TIME":
        ws.send(handleAddTime(data, ws));
        break;
      case "SUBTRACT_TIME":
        ws.send(handleSubtractTime(data, ws));
      default:
        console.log("default websocket -change it becouse it can be a bug ");
        break;
    }
  });
  console.log("Client connected to websocket");
});

module.exports = router;
