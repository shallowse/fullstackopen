/*
  State Model:
    a: String
*/

const notificationReducer = (state = 'INITIAL NOTIFICATION', action) => {
  //console.log('notificationReducer :: ', action);
  switch (action.type) {
    case 'SET_NOTIFICATION': {
      return action.data.text;
    }
    default:
      return state;
  }
};

export const setNotification = (text = '', duration = 5) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: { text },
    });
    setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        data: { text: '' },
      });
    }, duration * 1000);
  };
};

export default notificationReducer;
