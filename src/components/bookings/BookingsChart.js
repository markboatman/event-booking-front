import React from 'react';
// alias Bar to BarChart
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 10000000,
  },
};
// @29:30
const BookingsChart = (props) => {
  // this executes when component loads
  const chartData = { labels: [], datasets: [] };
  let bookingCosts = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price < BOOKINGS_BUCKETS[bucket].max &&
        current.event.price > BOOKINGS_BUCKETS[bucket].min
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    chartData.labels.push(bucket);
    bookingCosts.push(filteredBookingsCount);
    chartData.datasets.push({
      data: bookingCosts,
      fillColor: 'rgba(220,220,220,0.5)',
      strokeColor: 'rgba(220,220,220,0.8)',
      highlightFill: 'rgba(220,220,220,0.75)',
      highlightStroke: 'rgba(220,220,220,1)',
    });
    // move reference to a copy of the current array
    bookingCosts = [...bookingCosts];
    // put a zero as the last value in the array
    // so format will be correct for data: [bookingCosts
    bookingCosts[bookingCosts.length - 1] = 0;
  } // end for in

  const chart = (
    <div style={{ textAlign: 'center' }}>
      <BarChart data={chartData} />
    </div>
  );
  // return <Bar data={} />
  return chart;
};

export default BookingsChart;
