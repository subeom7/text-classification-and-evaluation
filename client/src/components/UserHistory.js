import React, { useState } from 'react';
import styles from './Button.module.css';

const UserHistory = ({ userHistory, onDeleteHistory, onClearHistory }) => {
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState(null);

  const handleClearClick = () => {
    setDeleteEntryId(null);
    setShowClearConfirmation(true);
  };

  const handleDeleteClick = (id) => {
    setShowClearConfirmation(false);
    setDeleteEntryId(id);
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setShowClearConfirmation(false);
  };

  const handleConfirmDelete = () => {
    onDeleteHistory(deleteEntryId);
    setDeleteEntryId(null);
  };

  const handleCancel = () => {
    setShowClearConfirmation(false);
    setDeleteEntryId(null);
  };

  return (
    <div className="scrollable-box">
      <h2 style={{ textAlign: 'center' }}>User History</h2>
      {userHistory.length > 0 && (
        showClearConfirmation && deleteEntryId === null ? (
          <div>
            <button className={styles.button} onClick={handleConfirmClear}>
            Confirm
            </button>
            <button className={styles.button} onClick={handleCancel}>
              X
            </button>
          </div>
        ) : (
          <button className={styles.button} onClick={handleClearClick}>Clear All</button>
        )
      )}
      {userHistory.map((entry, index) => (
        <div key={index}>
          <p><strong>Document ID:</strong> {entry._id}</p>
          <p><strong>User ID:</strong> {entry.user_id}</p>
          <p><strong>Input:</strong> {entry.input_text}</p>
          <p><strong>AI Classification:</strong> {entry.classifier_result}</p>
          <p><strong>AI Highlighted Words:</strong> {entry.important_words}</p>
          <p><strong>User Classification:</strong> {entry.user_result || 'Not provided'}</p>
          <p><strong>User Highlighted Words:</strong> {entry.user_highlight || 'Not provided'}</p>
          {deleteEntryId === entry._id ? (
            <div>
              <button className={styles.button} onClick={handleConfirmDelete}>
                Confirm
              </button>
              <button className={styles.button} onClick={handleCancel}>
                X
              </button>
            </div>
          ) : (
            <button
              className={styles.button}
              onClick={() => handleDeleteClick(entry._id)}
            >
              Delete
            </button>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default UserHistory;