import { useState } from 'react';
import './App.css';

function App() {
  const [responseData, setResponseData] = useState(''); //hook

  const handleClick = async () => {
    try {
      //handles js result
      const response = await fetch('http://localhost:5000/api');
      const data = await response.text();
      console.log(data);
      setResponseData(data); // Update state with response data
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button style={{ fontSize: '20px', padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#4CAF50', color: 'white', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', marginRight: '10px' }} onClick={handleClick}>Click me</button>
      <p style={{ fontSize: '24px', padding: '20px', backgroundColor: '#F5F5F5', borderRadius: '10px', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)' }}>{responseData}</p> 
    </div>
  );
}

export default App;



