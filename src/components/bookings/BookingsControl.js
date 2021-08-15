import React from 'react';
import './BookingsControl.css';

const BookingsControl = (props) => {
  return (
    <div className="bookings-control">
      <button
        className={props.activeContentType === 'list' ? 'active' : ''}
        onClick={props.changeContentHandler.bind(this, 'list')}
      >
        Your Bookings
      </button>
      <button
        className={props.activeContentType === 'chart' ? 'active' : ''}
        onClick={props.changeContentHandler.bind(this, 'chart')}
      >
        Costs Chart
      </button>
    </div>
  );
};

export default BookingsControl;
