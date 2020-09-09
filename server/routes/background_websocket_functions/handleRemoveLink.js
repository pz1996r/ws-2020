const {
  ConnectedStudents,
  ActionsForOfflineStudents,
  lastActions,
} = require("../background_websocket_functions/globalParams");

module.exports = function handleRemoveLink({ email }, payload) {
  const user = ConnectedStudents["websocket"][email];
  lastActions[email] = payload;
  if (user) {
    // online user
    user.send(JSON.stringify({ payload }));
    delete ActionsForOfflineStudents[email];
  } else {
    // offline user
    ActionsForOfflineStudents[email] = { payload, data: {} };
  }
};
