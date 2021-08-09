import React from 'react';
import './EventItem.css';

const EventItem = (props) => {
  console.log('curUserId: ', props.curUserId, ' creatorId : ', props.creatorId);
  return (
    <li key={props.eventId} className="event__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>
          ${props.price} - {new Date(props.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {/* use bind to not excutue onDetail at render, only onClick */}
        {props.curUserId !== props.creatorId ? (
          <button
            className="btn"
            onClick={props.onDetail.bind(this, props.eventId)}
          >
            View Details
          </button>
        ) : (
          <p>You are the owner of this event.</p>
        )}
      </div>
    </li>
  );
};

export default EventItem;
