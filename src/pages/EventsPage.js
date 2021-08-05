import React, { Component } from 'react';
import './EventsPage.css';
import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/Backdrop';

class EventsPage extends Component {
  state = {
    creating: false,
  };

  showCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  render() {
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
                <input type="text" id="title"></input>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4"></textarea>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price"></input>
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="date" id="date"></input>
              </div>
            </form>
          </Modal>
        )}
        <div className="events-control">
          <p>Share Your EventsPage</p>
          <button className="btn" onClick={this.showCreateEventHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
