const {
  VOTE,
  JOIN,
  LEAVE,
  CLEAR_VOTES,
  REVEAL_VOTES,
  HIDE_VOTES,
} = require("./actionTypes");

const initialRoomState = {
  showVotes: false,
  votes: {},
  team: [],
};

const roomStateReducer = (state, action) => {
  const { socketId, name, value } = action.payload || {};
  const newRoomState = { ...state };

  switch (action.type) {
    case VOTE:
      newRoomState.votes[socketId] = value;

      if (
        Object.keys(newRoomState.votes).length === newRoomState.team.length &&
        newRoomState.team.length > 1
      ) {
        newRoomState.showVotes = true;
      }

      return newRoomState;
    case JOIN:
      const team_member = {
        name,
        socketId,
      };

      newRoomState.team.push(team_member);

      return newRoomState;
    case LEAVE:
      const index = newRoomState.team.findIndex(
        (team_member) => team_member.socketId === socketId
      );

      newRoomState.team.splice(index, 1);

      return newRoomState;

    case CLEAR_VOTES:
      newRoomState.votes = {};
      newRoomState.showVotes = false;

      return newRoomState;
    case REVEAL_VOTES:
      newRoomState.showVotes = true;

      return newRoomState;
    case HIDE_VOTES:
      newRoomState.showVotes = false;

      return newRoomState;
    default:
      return newRoomState;
  }
};

module.exports = { roomStateReducer, initialRoomState };
