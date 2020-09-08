const USERS = new WeakMap();
const rooms = {}; //id_room: { users: [], usersAmount, create_Room_STAMP, room_Timer_STAMP, timer }
const API = "https://ws-2020.herokuapp.com/api/";

// module.exports = {"rooms":rooms,USERS};
exports.USERS = USERS;
exports.rooms = rooms;
exports.API = API;
