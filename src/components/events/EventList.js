import React from 'react';
import './EventList.css';
import EventItem from './EventItem';

const EventList = (props) => {
  // build the JSX list of events, this.state.events is loaded
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        curUserId={props.authUserId}
        creatorId={event.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });
  // console.log(events);
  return <ul className="event__list">{events}</ul>;
};

export default EventList;
