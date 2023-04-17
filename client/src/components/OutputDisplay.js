import React from 'react';

const OutputDisplay = ({ responseData , results}) => {
  return (
    <>
      <div style={{ fontSize: '24px', padding: '10px', marginBottom: '-20px', fontWeight: 'bold' }}>Result:</div>
      {responseData && (
        <p style={{ fontSize: '24px', padding: '20px', backgroundColor: '#F5F5F5', borderRadius: '10px', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', overflowWrap: 'break-word', maxHeight: '300px', overflowY: 'auto' }}>{`${responseData.result}`}</p>
      )}
      <div style={{ fontSize: '24px', padding: '10px', marginBottom: '-20px', fontWeight: 'bold' }}>Important Words:</div>
      {responseData && (
        <p style={{ fontSize: '24px', padding: '20px', backgroundColor: '#F5F5F5', borderRadius: '10px', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}>{responseData.words}</p>
      )}
    </>
  );
};

export default OutputDisplay;
