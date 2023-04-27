import React from "react";
import styles from "./Button.module.css";

const InputForm = ({
  inputText,
  handleInputChange,
  handleClickSubmit,
  fileInputRef,
  handleFileInputChange,
  handleClickZip,
  fileData,
  handleListItemClick,
  handleFileUpload,
  filenameData,
  useHandleClick,
  handleClickSubmitText,
}) => {
  const handleClick = useHandleClick
    ? handleClickSubmit
    : handleClickSubmitText;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <textarea
        id="text-input"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Type here..."
        style={{
          fontSize: "23px",
          padding: "10px",
          borderRadius: "10px",
          border: "2px solid #ccc",
          backgroundColor: "#F5F5F5",
          color: "black",
          boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.25)",
          marginLeft: "100px",
          width: "800px",
          minHeight: "150px",
          resize: "none",
          overflow: "auto",
        }}
        onInput="this.style.height='auto'; this.style.height=(this.scrollHeight)+'px';"
      ></textarea>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ marginRight: "1px" , marginTop: "40px"}}>
          <div style={{ float: "left" }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <button
              className={styles.button}
              style={{
                fontSize: "24px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.25)",
                marginLeft: "10px",
                marginBottom: "10px",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              Upload
            </button>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className={styles.button}
                style={{
                  fontSize: "24px",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.25)",
                  marginLeft: "10px",
                }}
                onClick={handleClick}
              >
                Submit
              </button>
            </div>
          </div>
          <div
            style={{
              float: "left",
              height: "150px",
              overflow: "auto",
              marginLeft: "10px",
            }}
          >
            <ul>
              {fileData.map((string, index) => (
                <li
                key={index}
                onClick={() => handleListItemClick(index, string)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#eee",
                }}
              >
                {filenameData[index]}
              </li>
              
              ))}
            </ul>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;


