const {
  ConnectedStudents,
  lastActions,
} = require("../background_websocket_functions/globalParams");

module.exports = function handleGetStudents(ws) {
  ws.send(
    JSON.stringify({
      payload: "GET_STUDENTS",
      data: { students: ConnectedStudents["status"], lastActions },
    })
  );
};
