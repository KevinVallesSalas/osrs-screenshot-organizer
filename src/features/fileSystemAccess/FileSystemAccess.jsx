import React, { useState } from 'react';

function FileSystemAccess({ onFilesFound }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Recursive function to traverse directories, accepting a progress callback
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
            // Update progress with number of images found so far
            setProgressMessage(`Found ${files.length} image(s)...`);
          }
        } else if (entry.kind === 'directory') {
          // Recursively search in the subdirectory
          const subFiles = await getImageFiles(entry);
          files = files.concat(subFiles);
        }
      }
    } catch (error) {
      console.error(`[getImageFiles] Error scanning folder ${dirHandle.name}:`, error);
      // Propagate error so it can be caught in the outer try/catch
      throw error;
    }
    return files;
  };

  const handlePickDirectory = async () => {
    setErrorMessage('');
    setProgressMessage('');
    setImageFiles([]);
    if ('showDirectoryPicker' in window) {
      try {
        setIsSearching(true);
        // Prompt user to select a directory
        const dirHandle = await window.showDirectoryPicker();
        // Start recursive search from the selected directory
        const files = await getImageFiles(dirHandle);
        if (files.length === 0) {
          setProgressMessage('No valid image files found.');
        } else {
          setProgressMessage(`Search complete. Found ${files.length} image(s).`);
        }
        setImageFiles(files);
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

      {progressMessage && (
        <p style={{ marginTop: '1rem' }}>{progressMessage}</p>
      )}

      {errorMessage && (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}

      {imageFiles.length > 0 && (
        <div>
          <h3>Found {imageFiles.length} image(s):</h3>
          <ul>
            {imageFiles.map((fileEntry, index) => (
              <li key={index}>{fileEntry.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileSystemAccess;
