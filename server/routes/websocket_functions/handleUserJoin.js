const optionalChaining = require("./optionalChaining");
const { USERS } = require("./globalParams");
const { rooms } = require("./globalParams");

module.exports = function handleUserJoin({ room }, userIP, ws, userAgent) {
  function isItHost() {
    if (rooms[room]["users"]["nextUserId"] === 0) return true;
    if (rooms[room]["users"][0]) return false;
    if (
      rooms[room]["hostIP"] === userIP &&
      rooms[room]["hostAgent"] === userAgent
    ) {
      return true;
    }
  }
  function removeClearRoomTimer() {
    const clearRoomFunction = rooms[room]["clearRoomTimer"];
    clearTimeout(clearRoomFunction);
    rooms[room]["clearRoomTimer"] = null;
  }
  function createRoom() {
    rooms[room] = {
      users: {},
      usersAmount: 0,
      nextUserId: 1,
      create_Room_STAMP: new Date().getTime(),
      clearRoomTimer: null,
      hostIP: userIP,
      hostAgent: userAgent,
      TIMER: null,
    };
  }

  function addUserToRoom(ws) {
    const userId = isItHost() ? 0 : rooms[room]["nextUserId"]++;
    const role = userId === 0 ? "HOST" : "GUEST";
    rooms[room]["users"][userId] = ws;
    rooms[room]["usersAmount"]++;
    return { userId, role };
  }

  const doesRoomExist = optionalChaining(() => rooms[room]);
  if (!doesRoomExist) createRoom();
  if (rooms[room]["clearRoomTimer"]) removeClearRoomTimer();
  const { userId, role } = addUserToRoom(ws);
  USERS.set(ws, { id: userId, ip: userIP, room, role }); // adding USER to weakMap

  return JSON.stringify({
    payload: "CONNECTION",
    data: { info: "connected successfully", room, role },
  });
};
