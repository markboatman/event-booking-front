import React, { Component } from 'react';
import Backdrop from '../components/backdrop/Backdrop';
import EventList from '../components/events/EventList';
import Modal from '../components/modal/Modal';
import Spinner from '../components/spinner/Spinner';
import AuthContext from '../components/context/auth-context';
import './EventsPage.css';

class EventsPage extends Component {
  state = {
    creating: false,
    // populated by componentDidMount()
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  isActive = true;

  // This will create the class property "this.context"
  // Do not have to create this.context directly. Below
  // does it for us
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  // React gives us this lifecycle methond
  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    this.setState({ isLoading: true });
    const reqBody = {
      query: `
        query {
        events {
          _id
          title
          description
          date
          price
          creator {
            _id
            email
          }
        }
      }
      `,
    };

    // using standard fetch
    fetch(process.env.REACT_APP_BACKEND_URL + '/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        // tell receiver what format we are sending
        'Content-Type': 'application/json',
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
        const events = resJson.data.events;
        if (this.isActive) {
          this.setState({ events: events, isLoading: false });
        }
        console.log('Got events for events page: ', events);
      })
      .catch((err) => {
        console.log(err.message);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = (eventId) => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }

    const reqBody = {
      query: `
        mutation BookEvent($Id: ID!) {
        bookEvent(eventId: $Id) {
          _id
          createdAt
          updatedAt
        }
      }
      `,
      variables: {
        Id: this.state.selectedEvent._id,
      },
    };

    // using standard fetch
    fetch(process.env.REACT_APP_BACKEND_URL + '/graphql', {
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
        const eventBooking = resJson.data.bookEvent;
        console.log('Event booked: ', eventBooking);
        this.setState({ selectedEvent: null });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // React supplied
  componentWillUnmount() {}

  render() {
    // return some jsx
    return (
      <React.Fragment>
        {/* if user has clicked create event or clicked details of a listed
        event, put ui in Backdrop mode and present create or detail modal
        on top layer above event list.
      */}
        {this.state.selectedEvent && <Backdrop />}

        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? 'Book Event' : 'Close'}
            isLoggedIn={this.context.token}
          >
            <h2>
              ${this.state.selectedEvent.price} -{' '}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
            {!this.context.token && (
              <div>
                <hr />
                <p>Login to book this event.</p>
              </div>
            )}
          </Modal>
        )}
        {/* Always show this */}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
