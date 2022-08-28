const {
  roomStateReducer,
  initialRoomState,
} = require("../reducers/roomStateReducer.js");
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
  let state = initialRoomState;

  io.on("connection", (socket) => {
    const { id: socketId } = socket;

    socket.on(JOIN, ({ name }) => {
      const action = {
        type: JOIN,
        payload: {
          socketId,
          name,
        },
      };

      state = roomStateReducer(state, action);

      io.emit(UPDATE_STATE, state);
    });

    socket.on(VOTE, (vote) => {
      const action = {
        type: VOTE,
        payload: {
          socketId,
          value: vote.value,
        },
      };

      state = roomStateReducer(state, action);

      io.emit(UPDATE_STATE, state);
    });

    socket.on(CLEAR_VOTES, () => {
      const action = {
        type: CLEAR_VOTES,
      };

      state = roomStateReducer(state, action);

      io.emit(UPDATE_STATE, state);
    });

    socket.on(REVEAL_VOTES, () => {
      const action = {
        type: REVEAL_VOTES,
      };

      state = roomStateReducer(state, action);

      io.emit(UPDATE_STATE, state);
    });

    socket.on(HIDE_VOTES, () => {
      const action = {
        type: HIDE_VOTES,
      };

      state = roomStateReducer(state, action);

      io.emit(UPDATE_STATE, state);
    });

    socket.on("disconnect", () => {
      const action = {
        type: LEAVE,
        payload: {
          socketId,
        },
      };

      state = roomStateReducer(state, action);

      io.emit(UPDATE_STATE, state);
    });
  });

  return io;
};

module.exports = { setSocketEventHandlers };
