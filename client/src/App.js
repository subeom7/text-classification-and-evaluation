import { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleSignIn from './components/GoogleSignIn';
import UserHistory from './components/UserHistory';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import './App.css';

function App() {
  const [responseData, setResponseData] = useState('');
  const [inputText, setInputText] = useState('');
  const [userHistory, setUserHistory] = useState([]);
  const [user, setUser] = useState({});

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/history/${user.sub}`);
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
      const response = await axios.post('http://localhost:5002/classify', { text: inputText, user_id: user.sub });

      const data = response.data;
      console.log(data);
      setResponseData(data);

      setUserHistory([...userHistory, { input_text: inputText, output: data.result }]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', top: '10px', left: '200 px' }}>
        <GoogleSignIn setUser={setUser} />

        <div className="App">
          {user &&
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <div style={{ display: 'grid', alignItems: 'center' }}>
                <img src={user.picture}></img>
                <h3>{user.name}</h3>
                {Object.keys(user).length !== 0 &&
                  <button style={{ fontSize: '12px', padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#4CAF50', color: 'white', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)' }} onClick={(e) => handleSignOut(e)}>Sign Out</button>
                }
              </div>
            </div>
          }
        </div>

        <div style={{ position: 'absolute', top: '-100px', left: '10px' }}>
          {Object.keys(user).length !== 0 && (
            <UserHistory userHistory={userHistory} />
          )}
        </div>
        
      </div>
      <div style={{ fontSize: '24px', padding: '10px', marginBottom: '5px', fontWeight: 'bold' }}>Example Inputs:</div>
      <div style={{ fontSize: '20px', padding: '10px', marginBottom: '5px' }}>"Vitamin D supplement linked to lower dementia incidence."</div>
      <div style={{ fontSize: '20px', padding: '10px', marginBottom: '5px' }}>"Crypto Analytics Firm Explains Why Dogecoin Is Impressive."</div>
      <div style={{ fontSize: '20px', padding: '10px', marginBottom: '5px' }}>"Tesla cuts prices of Model S and Model X vehicles."</div>
      <InputForm inputText={inputText} handleInputChange={handleInputChange} handleClick={handleClick} />
      <OutputDisplay responseData={responseData} />
    </div>
  );
}

export default App;
