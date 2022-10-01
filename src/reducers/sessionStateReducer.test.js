const {
  VOTE,
  JOIN,
  LEAVE,
  CLEAR_VOTES,
  REVEAL_VOTES,
  HIDE_VOTES,
} = require("../customEventTypes");
const { sessionStateReducer } = require("./sessionStateReducer");

const initialSessionState = {
  showVotes: false,
  votes: {},
  team: [],
};

afterAll(() => {
  jest.clearAllMocks();
});

describe("SessionStateReducer", () => {
  describe("Vote", () => {
    it("should add a vote", () => {
      const action = {
        type: VOTE,
        payload: {
          socketId: "6y7hhh8j",
          value: "4",
        },
      };

      const state = sessionStateReducer(initialSessionState, action);

      expect(state).toEqual(
        expect.objectContaining({ votes: { "6y7hhh8j": "4" } })
      );
    });

    it("should reveal votes if all team members voted and voters number is bigger than 1", () => {
      const action = {
        type: VOTE,
        payload: {
          socketId: "6y7hhh8j",
          value: "4",
        },
      };

      const initialStateWithVotesAndTeam = {
        ...initialSessionState,
        votes: { hj65fgy: "2" },
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

      const state = sessionStateReducer(initialStateWithVotesAndTeam, action);

      expect(state).toEqual(expect.objectContaining({ showVotes: true }));
    });

    it("should not reveal votes if all team members voted and voters number equals 1", () => {
      const action = {
        type: VOTE,
        payload: {
          socketId: "6y7hhh8j",
          value: "4",
        },
      };

      const initialStateWithATeam = {
        ...initialSessionState,
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

      const state = sessionStateReducer(initialStateWithATeam, action);

      expect(state).toEqual(expect.objectContaining({ showVotes: false }));
    });
  });

  describe("Join", () => {
    it("should join a member", () => {
      const action = {
        type: JOIN,
        payload: {
          socketId: "6y7hhh8j",
          name: "Mario",
        },
      };

      const state = sessionStateReducer(initialSessionState, action);

      expect(state.team).toStrictEqual([
        {
          socketId: "6y7hhh8j",
          name: "Mario",
        },
      ]);
    });
  });

  describe("Leave", () => {
    it("should remove a member from team list on a LEAVE action", () => {
      const roomWithTeamMembersState = {
        ...initialSessionState,
        team: [{ socketId: "6y7hhh8j", name: "Mario" }],
      };
      const action = {
        type: LEAVE,
        payload: {
          socketId: "6y7hhh8j",
        },
      };

      const state = sessionStateReducer(roomWithTeamMembersState, action);

      expect(state.team).toStrictEqual([]);
    });

    it("should remove the vote of a left member on LEAVE action", () => {
      const roomWithvoteState = {
        ...initialSessionState,
        team: [{ sokcetId: "6y7hhh8j", name: "Mario" }],
        votes: { "6y7hhh8j": 2 },
      };
      const action = {
        type: LEAVE,
        payload: {
          socketId: "6y7hhh8j",
        },
      };

      const state = sessionStateReducer(roomWithvoteState, action);

      expect(state.votes).toStrictEqual({});
    });
  });

  describe("Clear votes", () => {
    it("should clear votes", () => {
      const action = {
        type: CLEAR_VOTES,
      };

      const initialStateWithVotes = {
        ...initialSessionState,
        votes: { "6y7hhh8j": "4" },
      };

      const state = sessionStateReducer(initialStateWithVotes, action);

      expect(state).toEqual(expect.objectContaining({ votes: {} }));
    });
  });

  describe("Reveal votes", () => {
    it("should reveal votes", () => {
      const action = {
        type: REVEAL_VOTES,
      };

      const initialStateWithVotes = {
        ...initialSessionState,
        votes: { "6y7hhh8j": "4" },
      };

      const state = sessionStateReducer(initialStateWithVotes, action);

      expect(state).toEqual(expect.objectContaining({ showVotes: true }));
    });
  });

  describe("Hide votes", () => {
    it("should hide votes", () => {
      const action = {
        type: HIDE_VOTES,
      };

      const initialStateWithVotes = {
        ...initialSessionState,
        showVotes: true,
        votes: { "6y7hhh8j": "4" },
      };

      const state = sessionStateReducer(initialStateWithVotes, action);

      expect(state).toEqual(expect.objectContaining({ showVotes: false }));
    });
  });
});
