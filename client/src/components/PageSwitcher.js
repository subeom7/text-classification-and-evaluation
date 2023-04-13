import React, { useState } from 'react';
import FileUploadPage from './FileUploadPage';
import RawTextPage from './RawTextPage';

function PageSwitcher() {
  const [currentPage, setCurrentPage] = useState('fileUploadPage');

  function handleButtonClick(page) {
    setCurrentPage(page);
  }

  return (
    <div>
      <button onClick={() => handleButtonClick('fileUploadPage')}>File Upload</button>
      <button onClick={() => handleButtonClick('rawTextPage')}>Raw Text</button>
      {currentPage === 'fileUploadPage' ? <FileUploadPage /> : <RawTextPage />}
    </div>
  );
}

export default PageSwitcher;