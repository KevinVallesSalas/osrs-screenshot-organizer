import React, { useState } from 'react';
import FileSystemAccess from './features/fileSystemAccess/FileSystemAccess';
import GalleryView from './features/gallery/GalleryView';
import './App.css'; // Import your global styles

function App() {
  const [imageFiles, setImageFiles] = useState([]);

  // Callback to receive image files from FileSystemAccess
  const handleFilesFound = (files) => {
    setImageFiles(files);
  };

  return (
    <div className="app-container">
      <h1>OSRS Screenshot Organizer</h1>
      <FileSystemAccess onFilesFound={handleFilesFound} />
      {imageFiles.length > 0 && <GalleryView imageFiles={imageFiles} />}
    </div>
  );
}

export default App;
