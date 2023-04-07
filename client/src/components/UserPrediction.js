import React from 'react';

const UserPrediction = ({ selectValue, setSelectValue }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div>
            <h2>Prediction:</h2>
        </div>
        <div>
            <select
                value={selectValue}
                onChange={(event) => setSelectValue(event.target.value)}
                style={{
                  fontSize: "24px",
                  padding: "10px 10px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.25)",
                  textAlign: "center",
                }}
              >
                <option value="">-- Select an option --</option>
                <option value="option1">Religion/Christian</option>
                <option value="option2">Computer/Graphics</option>
                <option value="option3">Science/Medicine</option>
                <option value="option4">Science/Electronics</option>
                <option value="option5">Science/Space</option>
                <option value="option6">Science/Cryptocurrency</option>
                <option value="option7">Sports/Baseball</option>
                <option value="option8">Sports/Hockey</option>
                <option value="option9">Automobile</option>
                <option value="option10">Politics/Guns</option>
              </select>
        </div>
    </div>
  );
};

export default UserPrediction;