import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/spinner/Spinner';
import BookingsList from '../components/bookings/BookingList';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };
  // make context available
  static contextType = AuthContext;
  // we we are added to the DOM
  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const reqBody = {
      query: `
        query {
        bookings {
          _id
          createdAt
          event {
            _id
            title
            date
          }
        }
      }
      `,
    };

    // using standard fetch
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        // tell receiver what format we are sending
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token,
      },
    })
      .then((res) => {
        // console.log('res.status: ', res.status);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Request to server failed!');
        }
        // else
        // this will return a promise so we can "then" it
        return res.json();
      })
      .then((resJson) => {
        // console.log(resJson);
        const bookings = resJson.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
        console.log('Got the bookings: ', bookings);
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({ isLoading: false });
      });
  };

  cancelBookingHandler = (bookingId) => {
    this.setState({ isLoading: true });
    const reqBody = {
      query: `
        mutation {
        cancelBooking(bookingId: "${bookingId}") {
          _id
          createdAt
          event {
            _id
            title
            date
          }
        }
      }
      `,
    };

    // using standard fetch
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        // tell receiver what format we are sending
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token,
      },
    })
      .then((res) => {
        // console.log('res.status: ', res.status);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Request to server failed!');
        }
        // else
        // this will return a promise so we can "then" it
        return res.json();
      })
      .then((resJson) => {
        // console.log(resJson);
        const booking = resJson.data.cancelBooking;
        this.setState((prevState) => {
          const updatedBookings = prevState.bookings.filter((curBooking) => {
            return curBooking._id !== booking._id;
          });
          return { bookings: updatedBookings, isLoading: false };
        });
        console.log('Cancelled booking: ', booking);
      })
      .catch((err) => {
        console.log(err.message);
        // this.setState({ isLoading: false });
      });
  };

  render() {
    // return some jsx
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <BookingsList
            bookings={this.state.bookings}
            onCancelBooking={this.cancelBookingHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
