import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
// import Backdrop from '../components/backdrop/Backdrop';
// import EventList from '../components/events/EventList';
import Modal from '../components/modal/Modal';
import Spinner from '../components/spinner/Spinner';
import AuthContext from '../components/context/auth-context';
import './EventsPage.css';

const withNavigation = (WrappedComponent) => (props) => {
  const navigation = useNavigate();

  return <WrappedComponent {...props} navigation={navigation} />;
};

class CreateEventPage extends Component {
  state = {
    canCreate: true,
    created: false,
    working: false,
    inputError: false,
  };
  // This will create the class property "this.context"
  // Do not have to create this.context directly. Below
  // does it for us
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    // create react ElRef(s) = element reference(s)
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  // React gives us this lifecycle methond
  componentDidMount() {}

  createEventHandler = () => {
    console.log('In CreateEventPage createEventHandler()');
    const title = this.titleElRef.current.value;
    const description = this.descriptionElRef.current.value;
    // this can return NaN I think, so +
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0
    ) {
      this.setState({ inputError: true });
      // JUMP OUT
      return;
    } else {
      this.setState({ inputError: false });
    }
    // else continue
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

    // using standard fetch
    this.setState({ working: true });
    fetch(process.env.REACT_APP_BACKEND_URL + '/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        // tell receiver what format we are sending
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.authUser.token}`,
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
        // SUCCESS
        console.log(resJson);
        console.log('Created event is: ', resJson.data.createEvent);
        this.setState({ canCreate: false, created: true, working: false });
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({ working: false });
      });
  };

  cancelHandler = () => {
    // probably don't need this
    this.setState({ canCreate: false, created: false });
    // redirect to all events page
    // useNavigate()('/events');
    this.props.navigation('/events');
  };

  // React supplied
  componentWillUnmount() {}
  // ={this.state.created}
  render() {
    // return some jsx
    return (
      <Modal
        title="Create Event"
        canCancel
        canCreate={this.state.canCreate}
        onCancel={this.cancelHandler}
        onConfirm={this.createEventHandler}
        confirmText="Create Event"
        isLoggedIn={this.context.authUser.token}
      >
        {this.state.working && <Spinner />}
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
            <input type="datetime-local" id="date" ref={this.dateElRef}></input>
          </div>
          {this.state.inputError && (
            <section>
              <hr />
              <p>Invalid input, please check your input values.</p>
            </section>
          )}
          {this.state.created && (
            <section>
              <hr />
              <p>Event "{this.titleElRef.current.value}" created!</p>
            </section>
          )}
        </form>
      </Modal>
    );
  }
}

export default withNavigation(CreateEventPage);
