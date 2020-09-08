const optionalChaining = require("./optionalChaining");
const { USERS, rooms } = require("./globalParams");

module.exports = function handleUserLeave(ws) {
  const { id, room, withoutRoom } = USERS.get(ws);
  if (!withoutRoom && optionalChaining(() => rooms[room])) {
    const isItLastUser = --rooms[room]["usersAmount"] <= 0;
    if (isItLastUser) {
      function deleteRoom() {
        // Cannot read property 'TIMER' of undefined
        clearInterval(rooms[room]["TIMER"]);
        delete rooms[room];
      }
      setTimeout(deleteRoom, 1000 * 60 * 5);
      rooms[room]["clearRoomTimer"] = deleteRoom;
    }
    delete rooms[room]["users"][id];
    console.log("Client is leaving websocket");
  }
};
