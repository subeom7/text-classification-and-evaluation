import React from "react";

const UserPrediction = ({ selectValue, setSelectValue }) => {
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <div>
      <h2>Your Classification:</h2>
      </div>
      <div>
        <select
          value={selectValue}
          onChange={async (event) => {
            setSelectValue(event.target.value);
            const selectedOption =
              document.getElementById("select-options").options[
                event.target.selectedIndex
              ];
            console.log(selectedOption.text);
          }}
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
          id="select-options"
        >
          <option value="">-- Select an option --</option>
          <option value="Religion/Christian" id="option1">
            Religion/Christian
          </option>
          <option value="Computer/Graphics" id="option2">
            Computer/Graphics
          </option>
          <option value="Science/Medicine" id="option3">
            Science/Medicine
          </option>
          <option value="Science/Electronics" id="option4">
            Science/Electronics
          </option>
          <option value="Science/Space" id="option5">
            Science/Space
          </option>
          <option value="Science/Cryptocurrency" id="option6">
            Science/Cryptocurrency
          </option>
          <option value="Sports/Baseball" id="option7">
            Sports/Baseball
          </option>
          <option value="Sports/Hockey" id="option8">
            Sports/Hockey
          </option>
          <option value="Automobile" id="option9">
            Automobile
          </option>
          <option value="Politics/Guns" id="option10">
            Politics/Guns
          </option>
        </select>
      </div>
    </div>
  );
};

export default UserPrediction;