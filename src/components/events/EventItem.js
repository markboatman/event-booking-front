import React from 'react';
import './EventItem.css';

const EventItem = (props) => {
  console.log('curUserId: ', props.curUserId, ' creatorId : ', props.creatorId);
  return (
    <li key={props.eventId} className="event__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>90.99</h2>
      </div>
      <div>
        {props.curUserId !== props.creatorId ? (
          <button className="btn">View Details</button>
        ) : (
          <p>You are the owner of this event.</p>
        )}
      </div>
    </li>
  );
};

export default EventItem;
