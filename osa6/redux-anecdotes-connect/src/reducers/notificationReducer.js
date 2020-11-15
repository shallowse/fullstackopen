/*
  State Model:
  {
    notificationText: String,
    timerIdQueue: Array
  }

Osa6: Exercise 6.21

Idea: we keep track of the timerIds in a queue and check whether we should cancel the timer or not
in case CANCEL_NOTIFICATION.

*/

const initialState = {
  notificationText: 'HELLO -- NOTIFICATION AREA',
  timerIdQueue: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION': {
      return {
        notificationText: action.payload.notificationText,
        timerIdQueue: [...state.timerIdQueue, action.payload.timerId],
      };
    }
    case 'CANCEL_NOTIFICATION': {
      const timerIdQueue = state.timerIdQueue;
      if (timerIdQueue.length > 1) {
        const timerId = timerIdQueue.shift();
        clearTimeout(timerId);
        const retObj = {
          notificationText: state.notificationText,
          timerIdQueue,
        };
        return retObj;
      }

      // All done, there's only one timer in the queue so now we can
      // return to the initial state and 'close' the notification message.
      const retObj = {
        notificationText: '',
        timerIdQueue: [],
      };
      return retObj;
    }
    default:
      return state;
  }
};

export const setNotification = (text = '', duration = 5) => {
  return (dispatch) => {
    const timerId = setTimeout(() => {
      dispatch({
        type: 'CANCEL_NOTIFICATION',
      });
    }, duration * 1000);

    dispatch({
      type: 'SET_NOTIFICATION',
      payload: {
        notificationText: text,
        timerId,
      }
    });
  };
};

export default notificationReducer;
