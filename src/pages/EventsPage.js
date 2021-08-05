import React, { Component } from 'react';
import './EventsPage.css';
import Modal from '../components/modal/Modal';

class EventsPage extends Component {
  render() {
    // return some jsx
    return (
      <React.Fragment>
        <Modal title="Add Event" canCancel canConfirm>
          <p>Modal Content</p>
        </Modal>
        <div className="events-control">
          <p>Share Your EventsPage</p>
          <button className="btn">Create Event</button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
