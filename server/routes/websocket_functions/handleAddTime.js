const optionalChaining = require("./optionalChaining");
const { USERS } = require("./globalParams");
const { rooms } = require("./globalParams");

module.exports = function handleAddTime({ timer }, ws) {
  let successfully;
  const user = USERS.get(ws);
  const { room } = user;

  const isTimerSeted = optionalChaining(() => rooms[room]["TIMER"]);
  if (isTimerSeted && user.role === "HOST") {
    rooms[room]["room_Timer_STAMP"] += timer;
    successfully = true;
  }

  return JSON.stringify({
    payload: "ADD_TIME",
    data: {
      info: `add time ${successfully ? "succesfully" : "unsuccesfully"}`,
    },
  });
};
