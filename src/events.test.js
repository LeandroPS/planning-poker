const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const { setEventHandlers } = require("./events.js");

const {
  VOTE,
  JOIN,
  LEAVE,
  CLEAR_VOTES,
  REVEAL_VOTES,
  HIDE_VOTES,
  UPDATE_STATE,
} = require("./customEventTypes");
const {
  roomStateReducer,
  initialRoomState,
} = require("./reducers/roomStateReducer.js");

const mockedState = {
  showVotes: false,
  votes: { "6y7hhh8j": "2" },
  team: [
    {
      socketId: "hj65fgy",
      name: "jonas",
    },
    {
      socketId: "6y7hhh8j",
      name: "maria",
    },
  ],
};

jest.mock("./reducers/roomStateReducer.js", () => ({
  roomStateReducer: jest.fn(() => mockedState),
  initialRoomState: {
    showVotes: false,
    votes: {},
    team: [],
  },
}));

const mockedHandlers = {};

const mockedIo = {
  emit: jest.fn(),
  on: jest.fn((event, callBack) => {
    if (event === "connection") callBack(mockedIo);
    mockedHandlers[event] = callBack;
  }),
  trigger: jest.fn((event, params) => {
    //const socketId = 'hj65fgy';
    console.log(mockedHandlers);
    mockedHandlers[event](params);
  }),
  id: "hj65fgy",
};

describe("eventHandler()", () => {
  it("should emit an updtate to client state with tem memeber added on JOIN", () => {
    const server = setEventHandlers(mockedIo);

    const action = {
      type: JOIN,
    };

    const modifiedState = {
      ...mockedState,
      team: [
        {
          socketId: "hj65fgy",
          name: "jonas",
        },
        {
          socketId: "6y7hhh8j",
          name: "maria",
        },
      ],
    };

    roomStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(JOIN, { name: "jonas" });

    expect(roomStateReducer).toHaveBeenCalledWith(initialRoomState, action);
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should emit an updtate to client state with empty votes on CLEAR_VOTES", () => {
    const server = setEventHandlers(mockedIo);

    const action = {
      type: CLEAR_VOTES,
    };

    const modifiedState = {
      ...mockedState,
      votes: {},
    };

    roomStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(CLEAR_VOTES);

    expect(roomStateReducer).toHaveBeenCalledWith(initialRoomState, action);
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should emit an updtate to client state with votes being shown on REVEAL_VOTES", () => {
    const server = setEventHandlers(mockedIo);

    const action = {
      type: REVEAL_VOTES,
    };

    const modifiedState = {
      ...mockedState,
      showVotes: true,
    };

    roomStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(REVEAL_VOTES);

    expect(roomStateReducer).toHaveBeenCalledWith(initialRoomState, action);
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should emit an updtate to client state with votes being hidden on HIDE_VOTES", () => {
    const server = setEventHandlers(mockedIo);

    const action = {
      type: HIDE_VOTES,
    };

    const modifiedState = {
      ...mockedState,
      showVotes: false,
    };

    roomStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(HIDE_VOTES);

    expect(roomStateReducer).toHaveBeenCalledWith(initialRoomState, action);
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  // it("should emit an updtate to client state with team member being removed on LEAVE", () => {
  //   const server = setEventHandlers(mockedIo);

  //   const action = {
  //     type: LEAVE,
  //   };

  //   const modifiedState = {
  //     ...mockedState,
  //     team: [
  //       {
  //         socketId: "6y7hhh8j",
  //         name: "maria",
  //       },
  //     ],
  //   };

  //   roomStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

  //   server.trigger("disconnect");

  //   expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  //   expect(roomStateReducer).toHaveBeenCalledWith(initialRoomState, action);
  // });
});
