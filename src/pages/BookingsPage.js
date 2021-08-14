import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/spinner/Spinner';
import BookingsList from '../components/bookings/BookingsList';
import BookingsChart from '../components/bookings/BookingsChart';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    contentType: 'list',
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
      /*
        Using gql recommended method for variable value injections.
        Name the query or mutation after query/mutation keyword and
        set reference the passed in parameter(s) with type.
        Re-factor variable ref in query/mutation, i.e. no "${}" just
        $var-name.
        Add second field (variables:) to the reqBody that sets up/defines the 
        parameter/var references for graphql.
        */

      query: `
        mutation CancelBooking($id: ID!) {
        cancelBooking(bookingId: $id) {
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
      variables: {
        // bookingId is being passed in to this handler
        id: bookingId,
      },
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

  changeContentHandler = (contentType) => {
    if (contentType === 'list') {
      this.setState({ contentType: 'list' });
    } else {
      this.setState({ contentType: 'chart' });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <div>
            <button onClick={this.changeContentHandler.bind(this, 'list')}>
              Your Bookings
            </button>
            <button onClick={this.changeContentHandler.bind(this, 'chart')}>
              Bookings Costs
            </button>
          </div>
          <div>
            {this.state.contentType === 'list' ? (
              <BookingsList
                bookings={this.state.bookings}
                onCancelBooking={this.cancelBookingHandler}
              />
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }
    // return some jsx
    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingsPage;
