import React, { useState } from 'react';
import FileSystemAccess from './features/fileSystemAccess/FileSystemAccess';
import GalleryView from './features/gallery/GalleryView';

function App() {
  const [imageFiles, setImageFiles] = useState([]);

  // Callback to receive image files from FileSystemAccess
  const handleFilesFound = (files) => {
    setImageFiles(files);
  };

  return (
    <div>
      <h1>OSRS Screenshot Organizer</h1>
      {/* FileSystemAccess will call handleFilesFound after scanning */}
      <FileSystemAccess onFilesFound={handleFilesFound} />
      {/* Only render GalleryView if imageFiles is not empty */}
      {imageFiles.length > 0 && <GalleryView imageFiles={imageFiles} />}
    </div>
  );
}

export default App;
