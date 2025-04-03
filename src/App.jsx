// App.jsx
import React, { useState } from 'react';
import FileSystemAccess from './features/fileSystemAccess/FileSystemAccess';
import GalleryView from './features/gallery/GalleryView';
import './App.css';

function App() {
  // State will hold the flattened array of file objects.
  const [fileArray, setFileArray] = useState(null);

  // Callback receives the flattened file array from FileSystemAccess.
  const handleFilesFound = (fileArrayFromFS) => {
    console.log('Flattened File Array:', fileArrayFromFS);
    setFileArray(fileArrayFromFS);
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>OSRS Screenshot Organizer</h1>
        <FileSystemAccess onFilesFound={handleFilesFound} />
      </header>
      {fileArray && <GalleryView fileArray={fileArray} />}
    </div>
  );
}

export default App;
