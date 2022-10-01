const { setSocketEventHandlers } = require("./socketEventHandlers.js");
const {
  VOTE,
  JOIN,
  LEAVE,
  CLEAR_VOTES,
  REVEAL_VOTES,
  HIDE_VOTES,
  UPDATE_STATE,
} = require("../customEventTypes");
const {
  sessionStateReducer,
  initialSessionState,
} = require("../reducers/sessionStateReducer.js");

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

jest.mock("../reducers/sessionStateReducer.js", () => ({
  sessionStateReducer: jest.fn(() => mockedState),
  initialSessionState: {
    showVotes: false,
    votes: {},
    team: [],
  },
}));

const mockedHandlers = {};

let mockedIo;

beforeEach(() => {
  jest.clearAllMocks();

  mockedIo = {
    emit: jest.fn(),
    to: jest.fn(() => mockedIo),
    on: jest.fn((event, callBack) => {
      if (event === "connection") callBack(mockedIo);
      mockedHandlers[event] = callBack;
    }),
    trigger: jest.fn((event, params) => {
      mockedHandlers[event](params);
    }),
    join: jest.fn(),
    disconnect: jest.fn(),
    id: "hj65fgy",
    rooms: ["hj65fgy", "hji-jih-pot"],
    leave: jest.fn(),
    onAny: jest.fn(),
  };
});

describe("setSocketEventHandlers()", () => {
  it("should emit a state update to session with a team member added on JOIN", () => {
    const server = setSocketEventHandlers(mockedIo);

    const action = {
      type: JOIN,
      payload: {
        socketId: "hj65fgy",
        name: "jonas",
      },
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

    sessionStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(JOIN, { name: "jonas", sessionId: "hji-jih-pot" });

    expect(sessionStateReducer).toHaveBeenCalledWith(
      initialSessionState,
      action
    );
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should emit a state update to session with a vote added on VOTE", () => {
    const server = setSocketEventHandlers(mockedIo);

    const action = {
      type: VOTE,
      payload: {
        socketId: "hj65fgy",
        value: 2,
      },
    };

    const modifiedState = {
      ...mockedState,
      votes: { hj65fgy: "2", "6y7hhh8j": "2" },
    };

    sessionStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(VOTE, { value: 2 });

    expect(sessionStateReducer).toHaveBeenCalledWith(
      initialSessionState,
      action
    );
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should emit a state update to session with votes emptied on CLEAR_VOTES", () => {
    const server = setSocketEventHandlers(mockedIo);

    const action = {
      type: CLEAR_VOTES,
    };

    const modifiedState = {
      ...mockedState,
      votes: {},
    };

    sessionStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(CLEAR_VOTES);

    expect(sessionStateReducer).toHaveBeenCalledWith(
      initialSessionState,
      action
    );
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should emit a state update to session with votes being shown on REVEAL_VOTES", () => {
    const server = setSocketEventHandlers(mockedIo);

    const action = {
      type: REVEAL_VOTES,
    };

    const modifiedState = {
      ...mockedState,
      showVotes: true,
    };

    sessionStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(REVEAL_VOTES);

    expect(sessionStateReducer).toHaveBeenCalledWith(
      initialSessionState,
      action
    );
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should emit a state update to session state with votes being hidden on HIDE_VOTES", () => {
    const server = setSocketEventHandlers(mockedIo);

    const action = {
      type: HIDE_VOTES,
    };

    const modifiedState = {
      ...mockedState,
      showVotes: false,
    };

    sessionStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(HIDE_VOTES);

    expect(sessionStateReducer).toHaveBeenCalledWith(
      initialSessionState,
      action
    );
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should emit a state update to session with a team member being removed when socket disconnects", () => {
    const server = setSocketEventHandlers(mockedIo);

    const action = {
      type: LEAVE,
      payload: {
        socketId: "hj65fgy",
      },
    };

    const modifiedState = {
      ...mockedState,
      team: [
        {
          socketId: "6y7hhh8j",
          name: "maria",
        },
      ],
    };

    sessionStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger("disconnect");

    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
    expect(sessionStateReducer).toHaveBeenCalledWith(
      initialSessionState,
      action
    );
  });

  it("should emit a state update to session with a team member being removed on LEAVE", () => {
    const server = setSocketEventHandlers(mockedIo);

    const action = {
      type: LEAVE,
      payload: {
        socketId: "hj65fgy",
      },
    };

    const modifiedState = {
      ...mockedState,
      team: [
        {
          socketId: "6y7hhh8j",
          name: "maria",
        },
      ],
    };

    sessionStateReducer.mockImplementationOnce(jest.fn(() => modifiedState));

    server.trigger(LEAVE);

    expect(sessionStateReducer).toHaveBeenCalledWith(
      initialSessionState,
      action
    );
    expect(server.emit).toHaveBeenCalledWith(UPDATE_STATE, modifiedState);
  });

  it("should disconnect socket on LEAVE", () => {
    const server = setSocketEventHandlers(mockedIo);

    server.trigger(LEAVE);

    expect(server.disconnect).toHaveBeenCalled();
  });
});
