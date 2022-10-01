const {
  sessionStateReducer,
  initialSessionState,
} = require("../reducers/sessionStateReducer.js");
const {
  VOTE,
  JOIN,
  LEAVE,
  CLEAR_VOTES,
  REVEAL_VOTES,
  HIDE_VOTES,
  UPDATE_STATE,
} = require("../customEventTypes");

const setSocketEventHandlers = (io) => {
  const sessions = {};

  io.on("connection", (socket) => {
    const { id: socketId, rooms } = socket;

    const getSessionId = () => {
      const [, sessionId] = socket.rooms.values();

      return sessionId;
    };

    const getCurrentSessionState = () =>
      sessions[getSessionId()] || initialSessionState;

    socket.on(JOIN, ({ name, sessionId }) => {
      const action = {
        type: JOIN,
        payload: {
          socketId,
          name,
        },
      };

      socket.join(sessionId);

      const currentSessionState = getCurrentSessionState();
      sessions[getSessionId()] = sessionStateReducer(
        currentSessionState,
        action
      );

      io.to(sessionId).emit(UPDATE_STATE, sessions[sessionId]);
    });

    socket.on(VOTE, (vote) => {
      const action = {
        type: VOTE,
        payload: {
          socketId,
          value: vote.value,
        },
      };

      const currentSessionState = getCurrentSessionState();
      sessions[getSessionId()] = sessionStateReducer(
        currentSessionState,
        action
      );

      io.to(getSessionId()).emit(UPDATE_STATE, sessions[getSessionId()]);
    });

    socket.on(CLEAR_VOTES, () => {
      const action = {
        type: CLEAR_VOTES,
      };

      const currentSessionState = getCurrentSessionState();
      sessions[getSessionId()] = sessionStateReducer(
        currentSessionState,
        action
      );

      io.to(getSessionId()).emit(UPDATE_STATE, sessions[getSessionId()]);
    });

    socket.on(REVEAL_VOTES, () => {
      const action = {
        type: REVEAL_VOTES,
      };

      const currentSessionState = getCurrentSessionState();
      sessions[getSessionId()] = sessionStateReducer(
        currentSessionState,
        action
      );

      io.to(getSessionId()).emit(UPDATE_STATE, sessions[getSessionId()]);
    });

    socket.on(HIDE_VOTES, () => {
      const action = {
        type: HIDE_VOTES,
      };

      const currentSessionState = getCurrentSessionState();
      sessions[getSessionId()] = sessionStateReducer(
        currentSessionState,
        action
      );

      io.to(getSessionId()).emit(UPDATE_STATE, sessions[getSessionId()]);
    });

    socket.on(LEAVE, () => {
      const action = {
        type: LEAVE,
        payload: {
          socketId,
        },
      };

      const currentSessionState = getCurrentSessionState();
      sessions[getSessionId()] = sessionStateReducer(
        currentSessionState,
        action
      );

      io.to(getSessionId()).emit(UPDATE_STATE, sessions[getSessionId()]);

      socket.leave(getSessionId());
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      const action = {
        type: LEAVE,
        payload: {
          socketId,
        },
      };

      const currentSessionState = getCurrentSessionState();
      sessions[getSessionId()] = sessionStateReducer(
        currentSessionState,
        action
      );

      io.to(getSessionId()).emit(UPDATE_STATE, sessions[getSessionId()]);
    });
  });

  return io;
};

module.exports = { setSocketEventHandlers };
