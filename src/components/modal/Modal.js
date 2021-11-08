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
        {/* This will show the modals child elements <Modal><child/</Modal> */}
        {props.children}
      </section>
      <section className="modal__actions">
        {props.canCancel && props.isLoggedIn && (
          <section>
            <button className="btn" onClick={props.onCancel}>
              Close
            </button>
          </section>
        )}
        {props.canConfirm && (
          <button className="btn" onClick={props.onConfirm}>
            {props.confirmText}
          </button>
        )}
      </section>
    </div>
  );
};

export default Modal;
