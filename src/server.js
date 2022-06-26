const { setEventHandlers } = require("./events.js");
const { Server } = require("socket.io");

const init = () => {
  const server = new Server();

  const serverWithHandlers = setEventHandlers(server);

  serverWithHandlers.listen(3000);

  serverWithHandlers.on("connection", (socket) => {
    console.log("novo client");
    socket.on("planning", (data) => {
      console.log(data);
      if (data == "ola!") serverWithHandlers.emit("planning", "como vai?");
    });
  });
};

module.exports = { init };
