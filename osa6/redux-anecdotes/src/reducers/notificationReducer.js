/*
  State Model:
    a: String
*/
const notificationReducer = (state = 'INITIAL NOTIFICATION', action) => {
  //console.log('notificationReducer :: ', action);
  const content = action.data && action.data.content;

  switch (action.type) {
    case 'VOTE':
      return `you voted '${content}'`;
    case 'NEW_ANECDOTE': {
      return `you added '${content}'`;
    }
    default:
      return state;
  }
};

export default notificationReducer;
