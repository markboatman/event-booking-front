import React, { Component } from 'react';
import './EventsPage.css';
import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/Backdrop';
import AuthContext from '../context/auth-context';

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
  };
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

  modalConfirmHandler = () => {
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
    // construct an event object with input data
    const event = { title, description, price, date };
    console.log(event);

    const reqBody = {
      query: `
        mutation {
        createEvent(eventInput: {
          title: "${title}"
          description: "${description}"
          price: ${price}
          date: "${date}"
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
    };

    /*
      On modern browsers, if you make a request to a server ( NOT localhost:3000) that did not give you 
      this javascript , this code will running on the users browser will check
      the response to the fetch and look for response headers coming from the other server (localhost:4000)
      stating that cross-origin requests are okay. Need to set this up on the graphql server

      To see response to this request, use dev-tools network tab and open response
      use preview tab to view the graphql data
    */

    // using standard fetch
    fetch('http://localhost:4000/graphql', {
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
        this.fetchEvents();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchEvents = () => {
    const reqBody = {
      query: `
        query {
        events {
          title
          description
          date
          price
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
        console.log(resJson);
        const events = resJson.data.events;
        this.setState({ events: events });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  render() {
    const eventList = this.state.events.map((event) => {
      return (
        <li key={event._id} className="events__list-item">
          {event.title}
        </li>
      );
    });

    // return some jsx
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
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
        {this.context.token && (
          <div className="events-control">
            <p>Share Your EventsPage</p>
            <button className="btn" onClick={this.showCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">{eventList}</ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
