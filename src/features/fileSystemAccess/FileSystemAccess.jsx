import React, { useState } from 'react';

function FileSystemAccess({ onFilesFound }) {
  const [isSearching, setIsSearching] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Recursive function to traverse directories
  const getImageFiles = async (dirHandle) => {
    let files = [];
    setProgressMessage(`Scanning folder: ${dirHandle.name}`);
    try {
      for await (const entry of dirHandle.values()) {
        // If it's a file, check extension
        if (entry.kind === 'file') {
          const ext = entry.name.split('.').pop().toLowerCase();
          if (['jpg', 'jpeg', 'png'].includes(ext)) {
            files.push(entry);
            setProgressMessage(`Found ${files.length} image(s)...`);
          }
        } else if (entry.kind === 'directory') {
          const subFiles = await getImageFiles(entry);
          files = files.concat(subFiles);
        }
      }
    } catch (error) {
      console.error(`[getImageFiles] Error scanning folder ${dirHandle.name}:`, error);
      throw error;
    }
    return files;
  };

  const handlePickDirectory = async () => {
    setErrorMessage('');
    setProgressMessage('');
    if ('showDirectoryPicker' in window) {
      try {
        setIsSearching(true);
        const dirHandle = await window.showDirectoryPicker();
        const files = await getImageFiles(dirHandle);
        if (files.length === 0) {
          setProgressMessage('No valid image files found.');
        } else {
          setProgressMessage(`Search complete. Found ${files.length} image(s).`);
        }
        if (onFilesFound) {
          onFilesFound(files);
        }
      } catch (err) {
        console.error('[handlePickDirectory] Directory selection failed:', err);
        setErrorMessage('Directory selection failed or was cancelled.');
      } finally {
        setIsSearching(false);
      }
    } else {
      setErrorMessage('File System Access API is not supported in this browser.');
      console.error('[handlePickDirectory] File System Access API is not supported in this browser.');
    }
  };

  return (
    <div>
      <button onClick={handlePickDirectory} disabled={isSearching}>
        {isSearching ? 'Searching...' : 'Pick Screenshot Folder'}
      </button>
      {progressMessage && <p style={{ marginTop: '1rem' }}>{progressMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default FileSystemAccess;
