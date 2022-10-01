const {
  VOTE,
  JOIN,
  LEAVE,
  CLEAR_VOTES,
  REVEAL_VOTES,
  HIDE_VOTES,
} = require("../customEventTypes");

const deepCloneObject = (value) => JSON.parse(JSON.stringify(value));

const initialSessionState = {
  showVotes: false,
  votes: {},
  team: [],
};

const sessionStateReducer = (state, action) => {
  const { socketId, sessionId, name, value } = action.payload || {};
  const newSessionState = deepCloneObject(state);

  switch (action.type) {
    case JOIN:
      const team_member = {
        name,
        socketId,
      };

      if (!state[sessionId]) newSessionState.team.push(team_member);

      return newSessionState;
    case VOTE:
      newSessionState.votes[socketId] = value;

      if (
        Object.keys(newSessionState.votes).length ===
          newSessionState.team.length &&
        newSessionState.team.length > 1
      ) {
        newSessionState.showVotes = true;
      }

      return newSessionState;
    case CLEAR_VOTES:
      newSessionState.votes = {};
      newSessionState.showVotes = false;

      return newSessionState;
    case REVEAL_VOTES:
      newSessionState.showVotes = true;

      return newSessionState;
    case HIDE_VOTES:
      newSessionState.showVotes = false;

      return newSessionState;
    case LEAVE:
      const memberIndex = newSessionState.team.findIndex(
        (team_member) => team_member.socketId === socketId
      );

      newSessionState.team.splice(memberIndex, 1);

      delete newSessionState.votes[socketId];

      return newSessionState;
    default:
      return newSessionState;
  }
};

module.exports = { sessionStateReducer, initialSessionState };
