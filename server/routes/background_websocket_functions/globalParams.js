const STUDENTS = new WeakMap();
const ConnectedStudents = { websocket: {}, status: {} };
const ActionsForOfflineStudents = {};
const lastActions = {};

exports.STUDENTS = STUDENTS;
exports.ConnectedStudents = ConnectedStudents;
exports.ActionsForOfflineStudents = ActionsForOfflineStudents;
exports.lastActions = lastActions;
