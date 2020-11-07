/*
  State Model:
    a: String

  A hack for now to solve Tehtävä 6.21.

  The timers are pushed to a queue in setNotification().
  They are let to expire when they are due. The expiration is handled in the notifactionReducer()'s
  'CLEAR_NOTIFICATION'.
  Once when the timer queue has one timer left (queue.length === 1), the the notification
  is set to an empty value. We store the notification to show in a global variable 'gText'.

  The impicit assumption here is that CLEAR_NOTIFICATION is never called before a SET_NOTIFICATION
  so that we have something always in the timer queue.
*/
let timerIDQueue = [];
let gText = '';

const notificationReducer = (state = 'INITIAL NOTIFICATION', action) => {
  //console.log('notificationReducer :: ', action);
  switch (action.type) {
    case 'SET_NOTIFICATION': {
      return action.data.text;
    }
    case 'CLEAR_NOTIFICATION': {
      timerIDQueue.pop();
      if (timerIDQueue.length >= 1) {
        return gText;
      }
      return '';
    }
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
    const timerID = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, duration * 1000);
    timerIDQueue.push(timerID);
    gText = text;
  };
};

export default notificationReducer;
