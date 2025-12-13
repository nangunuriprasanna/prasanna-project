import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="transport-vehicles">
          <div className="vehicle vehicle-1">🚗</div>
          <div className="vehicle vehicle-2">🚙</div>
          <div className="vehicle vehicle-3">🚐</div>
          <div className="vehicle vehicle-4">🚌</div>
          <div className="vehicle vehicle-5">🏍️</div>
        </div>
        <div className="loader-text">
          <h3>Loading...</h3>
          <p>Preparing your transport booking</p>
        </div>
        <div className="road">
          <div className="road-line"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

