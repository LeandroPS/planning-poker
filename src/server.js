const { setSocketEventHandlers } = require("./handlers/socketEventHandler.js");
const server = require("http").createServer();

const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGIN;

const io = require("socket.io")(server, {
  cors: corsAllowedOrigins?.split(","),
});

const init = () => {
  const serverWithHandlers = setSocketEventHandlers(io);

  serverWithHandlers.listen(3000);
};

module.exports = { init };
