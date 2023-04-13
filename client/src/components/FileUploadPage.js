import React, { useState } from 'react';

function FileUploadPage() {
  return (
    <FileUploader />
  );
}

function FileUploader() {
  
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const handleFileUpload = (e) => {
    const newFiles = [...e.target.files];
    setFiles([...files, ...newFiles]);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    
    console.log(file);
    console.log(files);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    position: 'absolute',
    height: '100%',
    width: '100%'
  };

  const uploadBoxStyle = {
    width: '250px',
    height: '100%',
    border: '4px solid black',
    backgroundColor: '#eefdff',
    marginTop: '50px',
    marginRight: '20px',
    fontSize: '16px',
    color: 'black',
    textAlign: 'left',
    padding: '5px',
  };

  const textBoxStyle = {
    width: '600px',
    height: '90%',
    border: '4px solid black',
    backgroundColor: '#eefdff',
    marginTop: '50px',
    marginRight: '20px',
    fontSize: '16px',
    color: 'black',
    textAlign: 'left',
    paddingLeft: '10px',
  };

  const userBoxStyle = {
    width: '250px',
    height: '90%',
    border: '4px solid black',
    backgroundColor: '#eefdff',
    marginTop: '50px',
    marginRight: '20px',
    fontSize: '16px',
    color: 'black',
    textAlign: 'middle',
    padding: '5px',
  };

  const fileBoxStyle = {
    border: "1px solid black",
    padding: "10px",
    margin: "10px",
    cursor: "pointer",
  };
  
  return (
    <div style={containerStyle}>
      <div style={uploadBoxStyle}>
        <input style={{color: 'transparent'}} type="file" multiple onChange={handleFileUpload} />
        {files.map((file, index) => (
          <div
            key={index}
            onClick={() => handleFileClick(file, index)}
            style={{ ...fileBoxStyle }}
          >
            {file.name}
          </div>
        ))}
      </div>
      <div style={textBoxStyle}>
        {selectedFile && (
          <div>
            <pre>{fileContent}</pre>
          </div>
        )}
      </div>
      <div style={userBoxStyle}>
        <p>User Input</p>
      </div>
    </div>
  );
}

export default FileUploadPage;