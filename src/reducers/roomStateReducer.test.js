const {
  VOTE,
  JOIN,
  LEAVE,
  CLEAR_VOTES,
  REVEAL_VOTES,
  HIDE_VOTES,
} = require("./actionTypes");
const { roomStateReducer } = require("./roomStateReducer");

const initialRoomState = {
  showVotes: false,
  votes: {},
  team: [],
};

describe("RoomStateReducer", () => {
  describe("Vote", () => {
    it("should add a vote", () => {
      const action = {
        type: VOTE,
        payload: {
          socketId: "6y7hhh8j",
          value: "4",
        },
      };

      const state = roomStateReducer(initialRoomState, action);

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
        ...initialRoomState,
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

      const state = roomStateReducer(initialStateWithVotesAndTeam, action);

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
        ...initialRoomState,
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

      const state = roomStateReducer(initialStateWithATeam, action);

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

      const state = roomStateReducer(initialRoomState, action);

      expect(state.team).toStrictEqual([
        {
          socketId: "6y7hhh8j",
          name: "Mario",
        },
      ]);
    });
  });

  describe("Leave", () => {
    it("should not list a left member", () => {
      const action = {
        type: LEAVE,
        payload: {
          socketId: "6y7hhh8j",
        },
      };

      const state = roomStateReducer(initialRoomState, action);

      expect(state).not.toEqual(
        expect.objectContaining({
          team: { sokcetId: "6y7hhh8j", name: "Mario" },
        })
      );
    });
  });

  describe("Clear votes", () => {
    it("should clear votes", () => {
      const action = {
        type: CLEAR_VOTES,
      };

      const initialStateWithVotes = {
        ...initialRoomState,
        votes: { "6y7hhh8j": "4" },
      };

      const state = roomStateReducer(initialStateWithVotes, action);

      expect(state).toEqual(expect.objectContaining({ votes: {} }));
    });
  });

  describe("Reveal votes", () => {
    it("should reveal votes", () => {
      const action = {
        type: REVEAL_VOTES,
      };

      const initialStateWithVotes = {
        ...initialRoomState,
        votes: { "6y7hhh8j": "4" },
      };

      const state = roomStateReducer(initialStateWithVotes, action);

      expect(state).toEqual(expect.objectContaining({ showVotes: true }));
    });
  });

  describe("Hide votes", () => {
    it("should hide votes", () => {
      const action = {
        type: HIDE_VOTES,
      };

      const initialStateWithVotes = {
        ...initialRoomState,
        showVotes: true,
        votes: { "6y7hhh8j": "4" },
      };

      const state = roomStateReducer(initialStateWithVotes, action);

      expect(state).toEqual(expect.objectContaining({ showVotes: false }));
    });
  });
});
