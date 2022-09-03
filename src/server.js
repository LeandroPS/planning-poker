const { setSocketEventHandlers } = require("./handlers/socketEventHandlers.js");
const server = require("http").createServer();

const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGIN;
const port = process.env.PORT;

const io = require("socket.io")(server, {
  cors: corsAllowedOrigins?.split(","),
});

const init = () => {
  const serverWithHandlers = setSocketEventHandlers(io);

  serverWithHandlers.listen(port);

  console.log(`Server initiated listening to port ${port}`);
};

module.exports = { init };
