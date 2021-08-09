import React from 'react';
import './Modal.css';

const Modal = (props) => {
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{props.title}</h1>
      </header>
      <section className="modal__content">
        {/* props.children is a react thing */}
        {props.children}
      </section>
      <section className="modal__actions">
        {props.canCancel && (
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button className="btn" onClick={props.onConfirm}>
            Create Event
          </button>
        )}
      </section>
    </div>
  );
};

export default Modal;
