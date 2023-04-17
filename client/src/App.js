import { useState, useEffect, useRef } from "react";
import axios from "axios";
import GoogleSignIn from "./components/GoogleSignIn";
import UserHistory from "./components/UserHistory";
import InputForm from "./components/InputForm";
import OutputDisplay from "./components/OutputDisplay";
import "./App.css";
import UserPrediction from "./components/UserPrediction";
import Mark from "mark.js";
import styles from './components/Button.module.css';

function App() {
  const [responseData, setResponseData] = useState("");
  const [inputText, setInputText] = useState("");
  const [userHistory, setUserHistory] = useState([]);
  const [user, setUser] = useState({});
  const [selectValue, setSelectValue] = useState("");
  const fileInputRef = useRef(null);

  const [highlightedText, setHighlightedText] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);

  const [startPos, setStartPos] = useState(null);
  const textRef = useRef(null);
  let searchWords = responseData ? words2arr(responseData.words) : [];

  useEffect(() => {
    const markInstance = new Mark(textRef.current);
    markInstance.unmark();
    searchWords.forEach((word) => {
      markInstance.mark(word, {
        separateWordSearch: false,
        className: "highlight-yellow",
      });
    });
    highlightedText.forEach((word) => {
      markInstance.mark(word, {
        separateWordSearch: false,
        className: "highlight-blue",
      });
    });
  }, [searchWords, highlightedText]);

  const handleMouseDown = (event) => {
    setMouseDown(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    setStartPos(selection.anchorOffset);
  };

  const handleMouseUp = (event) => {
    setMouseDown(false);
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (selectedText) {
      const range = selection.getRangeAt(0);
      const { top, left } = range.getBoundingClientRect();
      const rect = textRef.current.getBoundingClientRect();
      const x = left - rect.left;
      const y = top - rect.top;
      const newHighlightedTexts = [...highlightedText, selectedText];
      //console.log(selectedText);
      setHighlightedText(newHighlightedTexts);
      // Store the highlighted text in your state or do something with it here
    }
  };

  const handleMouseMove = (event) => {
    if (mouseDown) {
      const selection = window.getSelection();
      selection.extend(event.target, selection.focusOffset);
    }
  };

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  function words2arr(str) {
    const words = str.split(")").map((word) => word.split("(")[0].trim());
    return words;
  }

  const handleFileInputChange = () => {
    const file = fileInputRef.current.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setInputText(reader.result); // Update inputText state with file contents
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/history/${user.sub}`
        );
        console.log("User history response:", response);
        setUserHistory(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (Object.keys(user).length !== 0) {
      fetchUserHistory();
    }
  }, [user]);

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:5002/classify", {
        text: inputText,
        user_id: user.sub,
      });

      const data = response.data;
      console.log(data);
      setResponseData(data);

      setUserHistory([
        ...userHistory,
        {
          _id: data.document_id,
          user_id: user.sub,
          input_text: inputText,
          classifier_result: data.result,
          important_words: data.words,
        },
      ]);
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if the default image URL also fails
    e.target.src = 'https://path/to/your/default/image.png';
  };

  const handleDeleteHistory = async (documentId) => {
    try {
      await axios.delete(`http://localhost:5002/history/delete/${user.sub}/${documentId}`);
      setUserHistory(userHistory.filter((entry) => entry._id !== documentId));
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleClearHistory = async () => {
    try {
      await axios.delete(`http://localhost:5002/history/clear/${user.sub}`);
      setUserHistory([]);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ display: "flex", top: "10px", left: "200 px" }}>
        <GoogleSignIn setUser={setUser} />

        <div className="App">
        {user && (
          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <div className={`${styles["user-info"]}`}>
              <img
                src={user.picture}
                onError={handleImageError}
                style={{ width: "50px", borderRadius: "50%" }}
              ></img>
              <h3 style={{ margin: "0" }}>{user.name}</h3>
              {Object.keys(user).length !== 0 && (
                <button
                  className={styles.button}
                  onClick={(e) => handleSignOut(e)}
                >
            Sign Out
          </button>
        )}
      </div>
    </div>
  )}
</div>


        <div style={{ position: "absolute", top: "-100px", left: "10px" }}>
          {Object.keys(user).length !== 0 && (
            <UserHistory userHistory={userHistory} onDeleteHistory={handleDeleteHistory} onClearHistory={handleClearHistory} />
          )}
        </div>
      </div>
      <div
        style={{
          fontSize: "24px",
          padding: "10px",
          marginBottom: "5px",
          fontWeight: "bold",
        }}
      >
        Example Inputs:
      </div>
      <div style={{ fontSize: "20px", padding: "10px", marginBottom: "5px" }}>
        "Vitamin D supplement linked to lower dementia incidence."
      </div>
      <div style={{ fontSize: "20px", padding: "10px", marginBottom: "5px" }}>
        "Crypto Analytics Firm Explains Why Dogecoin Is Impressive."
      </div>
      <div style={{ fontSize: "20px", padding: "10px", marginBottom: "5px" }}>
        "Tesla cuts prices of Model S and Model X vehicles."
      </div>
      <InputForm
        inputText={inputText}
        handleInputChange={handleInputChange}
        handleClick={handleClick}
        fileInputRef={fileInputRef}
        handleFileInputChange={handleFileInputChange}
      />
      <div
        ref={textRef}
        style={{ fontFamily: "Courier", marginTop: "10px", fontSize: '24px', padding: '20px', backgroundColor: '#F5F5F5', borderRadius: '10px', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', width: "800px",
        minHeight: "150px",
        resize: "none",
        overflow: "auto"}}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        
      >
        {inputText}
      </div>
      <UserPrediction
        setSelectValue={setSelectValue}
        selectValue={selectValue}
      />
      <OutputDisplay responseData={responseData} />

      
    </div>
  );
}

export default App;
