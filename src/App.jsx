// App.jsx
import React, { useState } from 'react';
import FileSystemAccess from './features/fileSystemAccess/FileSystemAccess';
import GalleryView from './features/gallery/GalleryView';
import './App.css';
import { getDB } from './database';

function App() {

  // Initialize DB at startup
getDB().then(() => {
  console.log('Database initialized and ready to use.');
}).catch((error) => {
  console.error('Failed to initialize DB:', error);
});

  // State will hold the flattened array of file objects.
  const [fileArray, setFileArray] = useState(null);

  // Callback receives the flattened file array from FileSystemAccess.
  const handleFilesFound = (fileArrayFromFS) => {
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
