import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [responseData, setResponseData] = useState('');
  const [inputText, setInputText] = useState('');

  const handleClick = async () => {
    try {
      // Make POST request to the Flask API
      const response = await axios.post('http://localhost:5002/classify', { text: inputText });
      const data = response.data;
      console.log(data);
      setResponseData(data); // Update state with response data
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ fontSize: '24px', padding: '10px', marginBottom: '10px',fontWeight: 'bold' }}>Example Inputs:</div>
      <div style={{ fontSize: '20px', padding: '10px', marginBottom: '10px' }}>"Dementia: Vitamin D supplements linked to 40% lower incidence."</div>
      <div style={{ fontSize: '20px', padding: '10px', marginBottom: '10px' }}>"Crypto Analytics Firm Explains Why Dogecoin Is Impressive."</div>
      <div style={{ fontSize: '20px', padding: '10px', marginBottom: '10px' }}>"Tesla cuts prices of Model S and Model X vehicles."</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input id="text-input" type="text" value={inputText} onChange={handleInputChange} placeholder="Type here..." style={{ fontSize: '20px', padding: '10px', borderRadius: '10px', border: '2px solid #ccc', backgroundColor: '#F5F5F5', color: 'black', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', marginLeft: '100px', width: '500px', height: '100px', resize: 'vertical' }} />
        <button style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#4CAF50', color: 'white', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', marginLeft: '10px' }} onClick={handleClick}>Submit</button>
      </div>
      {responseData && (
      <p style={{ fontSize: '24px', padding: '20px', backgroundColor: '#F5F5F5', borderRadius: '10px', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)' }}>{`Result: ${responseData.result}`}</p>
      )}
    </div>
  );
  
  
}


export default App;



