import React, { useState } from 'react';
import './SelectorStyles.css'; 

const ConnectionSelector = ({ selectedConnection, onConnectionTypeChange }) => {

  const connections = [
    'Butting',
    'Lapping 1/4 on a row',
    'Lapping 1/3 on a row',
    'Lapping 1/2 on a row',
    'Lapping 2/3 on a row',
    'Lapping 3/4 on a row'

  ];

  return (
      <div className="dropdowntwo">
        <select
            className="consel"
            value={selectedConnection}
            onChange={(e) => onConnectionTypeChange(e.target.value)}
        >

          {connections.map((connection, index) => (
              <option key={index} value={connection}>
                {connection}
              </option>
          ))}

        </select>

      </div>


  )
      ;
};

export default ConnectionSelector;
