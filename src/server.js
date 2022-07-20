const { setEventHandlers } = require("./events.js");
const server = require("http").createServer();

const io = require("socket.io")(server, {
  //path: "/test",
  //serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,

  transports: ["websocket"],
});

const init = () => {
  const serverWithHandlers = setEventHandlers(io);

  serverWithHandlers.listen(3000);

  // serverWithHandlers.on("connection", (socket) => {
  //   console.log("novo client");
  //   socket.on("planning", (data) => {
  //     console.log(data);
  //     if (data == "ola!") serverWithHandlers.emit("planning", "como vai?");
  //   });
  // });
};

module.exports = { init };
