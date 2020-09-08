const express = require("express");
const router = express.Router();

const { User } = require("../models/user");
const { Admin } = require("../models/admin");
const jwt = require("jsonwebtoken");

const { jwtPrivateKey } = process.env;
const STUDENTS = new WeakMap();
const ConnectedStudents = { websocket: {}, status: {} };
const ActionsForOfflineStudents = {};
const lastActions = {};

router.get("/", (req, res) => {
  res.send("Server is working, you can connect with websocket");
});
router.ws("/", async (ws, req) => {
  const token = req["headers"]["sec-websocket-protocol"];
  if (token === "undefined" || token === "null") return;
  const { _id } = jwt.verify(token, jwtPrivateKey);
  if (!_id) return;
  let user = await User.findOne({ _id });
  let admin = await Admin.findOne({ _id });
  if (!user && !admin) return;
  if (user) {
    const { email } = user;
    console.log("User is joining to background websocket", email);
    ConnectedStudents["websocket"][email] = ws;
    ConnectedStudents["status"][email] = true;
    STUDENTS.set(ws, user);
    if (ActionsForOfflineStudents[email]) {
      ws.send(JSON.stringify(ActionsForOfflineStudents));
      delete ActionsForOfflineStudents;
    }

    ws.on("close", () => {
      const { email } = STUDENTS.get(ws);
      delete ConnectedStudents["websocket"][email];
      delete ConnectedStudents["status"][email];
      console.log(`user is leaving background websocket: ${email}`);
    });
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
      const { payload, data } = JSON.parse(message);
      switch (payload) {
        case "SEND_LINK":
          var { email, link } = data;
          var user = ConnectedStudents["websocket"][email];
          lastActions[email] = payload;
          if (user) {
            // online user
            user.send(JSON.stringify({ payload, link }));
            delete ActionsForOfflineStudents[email];
          } else {
            // offline user
            ActionsForOfflineStudents[email] = { payload, link };
          }
          break;
        case "REMOVE_LINK":
          var { email } = data;
          var user = ConnectedStudents["websocket"][email];
          lastActions[email] = payload;
          if (user) {
            // online user
            user.send(JSON.stringify({ payload }));
            delete ActionsForOfflineStudents[email];
          } else {
            // offline user
            ActionsForOfflineStudents[email] = { payload, link };
          }
          break;
        case "GET_STUDENTS":
          console.log("GET_STUDENTS");
          ws.send(
            JSON.stringify({
              payload: "GET_STUDENTS",
              data: { students: ConnectedStudents["status"], lastActions },
            })
          );
          break;
        default:
          console.log("unhandled in backgroundwebsocket.js", payload);
      }
    });
    ws.on("close", () => {
      `admin is leaving background websockte`;
    });
  }
});

module.exports = router;
