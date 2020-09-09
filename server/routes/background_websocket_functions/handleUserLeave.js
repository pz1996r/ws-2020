const {
  STUDENTS,
  ConnectedStudents,
} = require("../background_websocket_functions/globalParams");

module.exports = function handleUserLeave(ws) {
  const { email } = STUDENTS.get(ws);
  delete ConnectedStudents["websocket"][email];
  delete ConnectedStudents["status"][email];
  console.log(`user is leaving background websocket: ${email}`);
};
