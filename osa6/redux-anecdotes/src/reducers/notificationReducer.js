/*
  State Model:
    a: String
*/
const notificationReducer = (state = 'INITIAL NOTIFICATION', action) => {
  //console.log('notificationReducer :: ', action);
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data.text;
    case 'CLEAR_NOTIFICATION':
      return '';
    default:
      return state;
  }
};

export const setNotification = (text = '', duration = 5000) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: { text },
    });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, duration * 1000);
  };
};

export default notificationReducer;
