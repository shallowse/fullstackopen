import React from 'react';
import { connect } from 'react-redux';

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginTop: '16px',
  };

  return (
    <div style={style}>
      {props.notification.notificationText}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  };
};

const ConnectedNotifcation = connect(
  mapStateToProps
)(Notification);

export default ConnectedNotifcation;
