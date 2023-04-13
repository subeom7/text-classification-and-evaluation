import React, { useState } from 'react';
import axios from 'axios';

function RawTextPage() {

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
            <div style={{ fontSize: '24px', padding: '10px', marginBottom: '5px', fontWeight: 'bold' }}>Example Inputs:</div>
            <div style={{ fontSize: '20px', padding: '10px', marginBottom: '5px' }}>"Dementia: Vitamin D supplements linked to 35% lower incidence."</div>
            <div style={{ fontSize: '20px', padding: '10px', marginBottom: '5px' }}>"Crypto Analytics Firm Explains Why Dogecoin Is Impressive."</div>
            <div style={{ fontSize: '20px', padding: '10px', marginBottom: '5px' }}>"Tesla cuts prices of Model S and Model X vehicles."</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <textarea id="text-input" value={inputText} onChange={handleInputChange} placeholder="Type here..." style={{ fontSize: '23px', padding: '10px', borderRadius: '10px', border: '2px solid #ccc', backgroundColor: '#F5F5F5', color: 'black', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', marginLeft: '100px', width: '800px', minHeight: '150px', resize: 'none', overflow: 'auto' }} onInput="this.style.height='auto'; this.style.height=(this.scrollHeight)+'px';"></textarea>
                <button style={{ fontSize: '24px', padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#4CAF50', color: 'white', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', marginLeft: '10px' }} onClick={handleClick}>Submit</button>
            </div>
            <div style={{ fontSize: '24px', padding: '10px', marginBottom: '-20px', fontWeight: 'bold' }}>Result:</div>
            {responseData && (
                <p style={{ fontSize: '24px', padding: '20px', backgroundColor: '#F5F5F5', borderRadius: '10px', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', overflowWrap: 'break-word', maxHeight: '300px', overflowY: 'auto' }}>{`${responseData.result}`}</p>
            )}
            <div style={{ fontSize: '24px', padding: '10px', marginBottom: '-20px', fontWeight: 'bold' }}>Important Words:</div>
            {responseData && (
                <p style={{ fontSize: '24px', padding: '20px', backgroundColor: '#F5F5F5', borderRadius: '10px', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}>{responseData.words}</p>
            )}
        </div>
    );
}

export default RawTextPage;