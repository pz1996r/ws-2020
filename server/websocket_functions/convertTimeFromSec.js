module.exports = function convertTimeFromSec(sec) {
  let tm = "";
  if (sec < 0) {
    tm += "-";
    sec = Math.abs(sec);
  }

  tm +=
    Math.floor((sec / 3600) % 24) < 10
      ? "0" + Math.floor((sec / 3600) % 24)
      : Math.floor((sec / 3600) % 24);
  tm += ":";
  tm +=
    Math.floor((sec / 60) % 60) < 10
      ? "0" + Math.floor((sec / 60) % 60)
      : Math.floor((sec / 60) % 60);
  tm += ":";
  tm +=
    Math.floor(sec % 60) < 10
      ? "0" + Math.floor(sec % 60)
      : Math.floor(sec % 60);
  return tm;
};
