import React from 'react';

// some kind of enumeration this ""
const BOOKINGS_BUCKETS = {
  Cheap: 100,
  Normal: 200,
  Expensive: 10000000,
};
// @22:00
const BookingsChart = (props) => {
  const output = {};
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (current.price < BOOKINGS_BUCKETS[bucket]) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    output[bucket] = filteredBookingsCount;
  }
  console.log(output);
  return <p>The Chart</p>;
};

export default BookingsChart;
