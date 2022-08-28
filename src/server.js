const { setSocketEventHandlers } = require("./handlers/socketEventHandler.js");
const server = require("http").createServer();

const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGIN;
const port = 3000;

const io = require("socket.io")(server, {
  cors: corsAllowedOrigins?.split(","),
});

const init = () => {
  const serverWithHandlers = setSocketEventHandlers(io);

  serverWithHandlers.listen(port);

  console.log(`Server initiated listening to port ${port}`);
};

module.exports = { init };
