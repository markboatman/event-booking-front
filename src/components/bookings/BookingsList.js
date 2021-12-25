import React from 'react';
import './BookingsList.css';

const BookingsList = (props) => {
  return (
    <ul className="bookings__list">
      {props.bookings.length < 1 ? (
        <li className="bookings__item">You currently have no bookings.</li>
      ) : (
        props.bookings.map((booking) => {
          return (
            <li className="bookings__item" key={booking._id}>
              {/* booking__item-data has no css */}
              <div className="bookings__item-data">
                {booking.event.title} -{' '}
                {new Date(booking.createdAt).toLocaleDateString()} -{' $'}
                {booking.event.price}
              </div>
              {/* bookings__item-actions has no css */}
              <div className="bookings__item-actions">
                <button
                  className="btn"
                  onClick={props.onCancelBooking.bind(this, booking._id)}
                >
                  Cancel
                </button>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
};

export default BookingsList;
