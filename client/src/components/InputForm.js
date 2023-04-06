import React from 'react';

const InputForm = ({ inputText, handleInputChange, handleClick }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <textarea id="text-input" value={inputText} onChange={handleInputChange} placeholder="Type here..." style={{ fontSize: '23px', padding: '10px', borderRadius: '10px', border: '2px solid #ccc', backgroundColor: '#F5F5F5', color: 'black', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', marginLeft: '100px', width: '800px', minHeight: '150px', resize: 'none', overflow: 'auto' }} onInput="this.style.height='auto'; this.style.height=(this.scrollHeight)+'px';"></textarea>
      <button style={{ fontSize: '24px', padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#4CAF50', color: 'white', boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)', marginLeft: '10px' }} onClick={handleClick}>Submit</button>
    </div>
  );
};

export default InputForm;
