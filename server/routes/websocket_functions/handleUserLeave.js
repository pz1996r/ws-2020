const optionalChaining = require("./optionalChaining");
const { USERS, rooms } = require("./globalParams");

module.exports = function handleUserLeave(ws) {
  const { id, room, withoutRoom } = USERS.get(ws);
  if (!withoutRoom && optionalChaining(() => rooms[room])) {
    const isItLastUser = --rooms[room]["usersAmount"] <= 0;
    delete rooms[room]["users"][id];
    console.log(rooms[room]);
    if (isItLastUser) {
      function deleteRoom() {
        console.log(() => rooms[room]["TIMER"]);
        clearInterval(rooms[room]["TIMER"]);
        delete rooms[room];
      }
      const deleteID = setTimeout(deleteRoom, 1000 * 60 * 5);
      rooms[room]["clearRoomTimer"] = deleteID;
    }
    console.log("Client is leaving websocket");
  }
};
