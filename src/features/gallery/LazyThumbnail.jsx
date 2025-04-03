import React, { useState, useRef, useEffect } from 'react';
import { getCachedThumbnail } from './thumbnailCache'; // Ensure this function returns a valid Blob URL, if available.

function LazyThumbnail({ fileEntry }) {
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Capture the current ref value so it's available in the callback and cleanup.
    const currentRef = containerRef.current;
    const observer = new IntersectionObserver(
      async (entries, observer) => {
        if (entries[0].isIntersecting) {
          // Try to get the cached thumbnail.
          let url = await getCachedThumbnail(fileEntry);
          // If no cached thumbnail is available or it's not a valid URL,
          // get the file and create an object URL.
          if (!url) {
            try {
              const file = await fileEntry.getFile();
              url = URL.createObjectURL(file);
            } catch (error) {
              console.error('Error getting file for thumbnail:', error);
            }
          }
          setThumbnailURL(url);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fileEntry]);

  return (
    <div
      ref={containerRef}
      style={{ width: '220px', height: '220px', margin: '0.5rem' }}
    >
      {thumbnailURL ? (
        <img
          src={thumbnailURL}
          alt={fileEntry.name}
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
      ) : (
        <div
          style={{
            width: '200px',
            height: '200px',
            backgroundColor: '#ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Loading...
        </div>
      )}
      <p>{fileEntry.name}</p>
    </div>
  );
}

export default LazyThumbnail;
