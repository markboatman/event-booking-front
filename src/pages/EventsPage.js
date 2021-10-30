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

  showCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCreateEventHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const description = this.descriptionElRef.current.value;
    // this can return NaN I think
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0
    ) {
      // don't do anything
      return;
    }
    // else
    // construct an event object with input data, ES6 syntax
    const event = { title, description, price, date };
    console.log(event);

    const reqBody = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
        createEvent(eventInput: {
          title: $title
          description: $desc
          price: $price
          date: $date
        }) {
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
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date,
      },
    };

    /*
      On modern browsers, if you make a request to a server ( NOT localhost:3000) that did not give you 
      this javascript , this code running on the users browser will check
      the response to the fetch and look for response headers coming from the other server (localhost:4000)
      stating that cross-origin requests are okay. Need to set this up on the graphql server

      To see response to this request, use dev-tools network tab and open response
      use preview tab to view the graphql data
    */

    // using standard fetch
    fetch(process.env.REACT_APP_BACKEND_URL + '/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        // tell receiver what format we are sending
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`,
      },
    })
      .then((res) => {
        console.log('res.status: ', res.status);
        // add status === 500 check because graphql is acting unexpectedly on error
        // Graphql is generating a 500 on error. This is non standard behavior
        // Console will report 500 but will also console log graphql error
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Request to server failed!');
        }
        // else
        // this will return a promise so we can "then" it
        return res.json();
      })
      .then((resJson) => {
        console.log(resJson);
        this.setState((prefState) => {
          // expand the events array and copy
          const updatedEvents = [...prefState.events];
          console.log('Created event is: ', resJson.data.createEvent);

          updatedEvents.push(resJson.data.createEvent);
          //console.log('New events: ', updatedEvents);
          return { events: updatedEvents };
        });
        console.log('local events after addition: ', this.state.events);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

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
  componentWillUnmount() {
    // not sure what this is doing
    this.isActive = false;
  }

  render() {
    // return some jsx
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalCreateEventHandler}
            confirmText="Create Event"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  ref={this.dateElRef}
                ></input>
              </div>
            </form>
          </Modal>
        )}

        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? 'Book Event' : 'Confirm'}
          >
            <h2>
              ${this.state.selectedEvent.price} -{' '}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share Your EventsPage</p>
            <button className="btn" onClick={this.showCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
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
