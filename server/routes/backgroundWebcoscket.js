const express = require("express");
const router = express.Router();
const {
  STUDENTS,
  lastActions,
} = require("./background_websocket_functions/globalParams");

const handleSendLink = require("./background_websocket_functions/handleSendLink");
const handleRemoveLink = require("./background_websocket_functions/handleRemoveLink");
const handleGetStudents = require("./background_websocket_functions/handleGetStudents");
const verify = require("./background_websocket_functions/verify");
const handleUserJoin = require("./background_websocket_functions/handleUserJoin");
const handleUserLeave = require("./background_websocket_functions/handleUserLeave");

router.get("/", (req, res) => {
  res.send("Server is working, you can connect with websocket");
});

router.ws("/", async (ws, req) => {
  const token = req["headers"]["sec-websocket-protocol"];
  const [user, admin] = await verify(token);
  if (!user && !admin) return;

  if (user) {
    handleUserJoin(user, ws);
    ws.on("close", () => handleUserLeave(ws));
    ws.on("message", (message) => {
      const { payload } = JSON.parse(message);
      const { email } = STUDENTS.get(ws);
      switch (payload) {
        case "CLICK_LINK":
          delete lastActions[email];
          break;
        default:
          break;
      }
    });
  }

  if (admin) {
    console.log("Admin is joining to background websocket");
    ws.on("message", (message) => {
      console.log(message);
      const { payload, data } = JSON.parse(message);
      switch (payload) {
        case "SEND_LINK":
          handleSendLink(data, payload);
          break;
        case "REMOVE_LINK":
          handleRemoveLink(data, payload);
          break;
        case "GET_STUDENTS":
          handleGetStudents(ws);
          break;
        default:
          console.log("unhandled in backgroundwebsocket.js", payload);
          break;
      }
    });
    ws.on("close", () => console.log(`admin is leaving bws`));
  }
});

module.exports = router;
