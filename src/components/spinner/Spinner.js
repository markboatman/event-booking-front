import React from 'react';
import './Spinner.css';

const Spinner = (props) => {
  return (
    <div>
      <div className="spinner">
        <div className="lds-dual-ring"></div>
      </div>
      <h3>{props.message}</h3>
    </div>
  );
};

export default Spinner;
