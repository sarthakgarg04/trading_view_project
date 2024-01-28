// IntervalsTabs.jsx
import React, { useState } from 'react';
import './styles.css';

const IntervalsTabs = ({ intervals, onIntervalClick, selectedInterval }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleIntervalClick = (interval) => {
    onIntervalClick(interval);
    setDropdownOpen(false);
  };

  return (
    <div className="intervals-tabs-container">
      <div className="interval-dropdown" onClick={handleDropdownClick}>
        <button className="interval-tab">Interval:{selectedInterval}</button>
        {dropdownOpen && (
          <ul className="interval-dropdown-list">
            {intervals.map((interval) => (
              <li
                key={interval}
                className={`interval-dropdown-item ${interval === selectedInterval ? 'selected' : ''}`}
                onClick={() => handleIntervalClick(interval)}
              >
                {interval}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IntervalsTabs;
