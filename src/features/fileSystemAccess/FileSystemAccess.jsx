import React, { useState } from 'react';

function FileSystemAccess({ onFilesFound }) {
  const [isSearching, setIsSearching] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Recursive function to traverse directories and build a folder tree structure
  const getImageFilesTree = async (dirHandle) => {
    const tree = { 
      name: dirHandle.name, 
      files: [],          // Array of file entries (file handles) in the current folder
      subdirectories: []  // Array of nested folder objects
    };

    setProgressMessage(`Scanning folder: ${dirHandle.name}`);
    try {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const ext = entry.name.split('.').pop().toLowerCase();
          if (['jpg', 'jpeg', 'png'].includes(ext)) {
            tree.files.push(entry);
            setProgressMessage(`Found ${tree.files.length} image(s) in ${dirHandle.name}...`);
          }
        } else if (entry.kind === 'directory') {
          const subTree = await getImageFilesTree(entry);
          tree.subdirectories.push(subTree);
        }
      }
    } catch (error) {
      console.error(`[getImageFilesTree] Error scanning folder ${dirHandle.name}:`, error);
      throw error;
    }
    return tree;
  };

  // Helper function to count the total number of image files in the tree
  const countFiles = (tree) => {
    let count = tree.files.length;
    for (const sub of tree.subdirectories) {
      count += countFiles(sub);
    }
    return count;
  };

  /**
   * Recursively flattens the folder tree into an array of file objects.
   * Each file object includes:
   * { fileEntry, fileName, folderName }
   */
  const flattenFileArray = (tree, folderName = tree.name) => {
    let arr = [];
    tree.files.forEach(file => {
      arr.push({ fileEntry: file, fileName: file.name, folderName });
    });
    tree.subdirectories.forEach(sub => {
      arr = arr.concat(flattenFileArray(sub, sub.name));
    });
    return arr;
  };

  const handlePickDirectory = async () => {
    setErrorMessage('');
    setProgressMessage('');
    if ('showDirectoryPicker' in window) {
      try {
        setIsSearching(true);
        const dirHandle = await window.showDirectoryPicker();
        const fileTree = await getImageFilesTree(dirHandle);
        const totalFiles = countFiles(fileTree);

        if (totalFiles === 0) {
          setProgressMessage('No valid image files found.');
        } else {
          setProgressMessage(`Search complete. Found ${totalFiles} image(s).`);
        }

        // Flatten the folder tree into an array of file objects.
        const fileArray = flattenFileArray(fileTree);

        if (onFilesFound) {
          onFilesFound(fileArray);
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
