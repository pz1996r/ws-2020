const optionalChaining = require("./optionalChaining");
const convertTimeFromSec = require("./convertTimeFromSec");
const { USERS } = require("./globalParams");
const { rooms } = require("./globalParams");

module.exports = function handleSetTimer({ timer }, ws) {
  const user = USERS.get(ws);
  let successfully;

  if (user.role === "HOST") {
    const { room } = user;
    function setTimer() {
      const timer = () => {
        const TimerSeconds = Math.floor(
          (new Date().getTime() - rooms[room]["create_Room_STAMP"]) / 1000
        );
        const countDownSeconds = rooms[room]["room_Timer_STAMP"] - TimerSeconds;
        const closeToEnd =
          rooms[room]["room_Timer_STAMP"] - TimerSeconds <= 3 * 60;

        Object.values(rooms[room]["users"]).forEach((user) => {
          user.send(
            JSON.stringify({
              payload: "TIMER",
              data: {
                timer: convertTimeFromSec(TimerSeconds),
                countDown: convertTimeFromSec(countDownSeconds),
                roomTimerStamp: rooms[room]["room_Timer_STAMP"],
                closeToEnd,
              },
            })
          );
        });
      };
      return setInterval(timer, 1000);
    }

    const isTimerSeted = optionalChaining(() => rooms[room]["TIMER"]);
    // TO refeactor
    if (!isTimerSeted && isTimerSeted !== undefined) {
      rooms[room]["TIMER"] = setTimer();
      rooms[room]["room_Timer_STAMP"] = timer;
      successfully = true;
    }
    //  Zapisywać w room te dane : create_Room_STAMP, room_Timer_STAMP
  }

  return JSON.stringify({
    // opakować to w funckje przyjmującą dwa parametry payload i data !!!
    payload: "SET_TIMER",
    data: {
      info: `set timer ${successfully ? "succesfully" : "unsuccesfully"}`,
    },
  });
};
