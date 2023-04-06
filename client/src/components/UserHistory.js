import React from 'react';

const UserHistory = ({ userHistory }) => {
  return (
    <div className="scrollable-box">
      <h2 style={{ textAlign: 'center' }}>User History</h2>
      {userHistory.map((entry, index) => (
        <div key={index}>
          <p><strong>Input:</strong> {entry.input_text}</p>
          <p><strong>Result:</strong> {entry.output}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default UserHistory;
