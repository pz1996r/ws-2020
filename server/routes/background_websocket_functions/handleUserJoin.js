const {
  STUDENTS,
  ConnectedStudents,
  ActionsForOfflineStudents,
} = require("../background_websocket_functions/globalParams");

module.exports = function handleUserJoin(user, ws) {
  const { email } = user;
  console.log("User is joining to background websocket", email);
  ConnectedStudents["websocket"][email] = ws;
  ConnectedStudents["status"][email] = true;
  STUDENTS.set(ws, user);
  if (ActionsForOfflineStudents[email]) {
    ws.send(JSON.stringify(ActionsForOfflineStudents));
    delete ActionsForOfflineStudents;
  }
};
