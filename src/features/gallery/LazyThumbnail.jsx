import React, { useState, useRef, useEffect } from 'react';
import { getCachedThumbnail } from './thumbnailCache';

function LazyThumbnail({ fileEntry }) {
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Capture the current ref value in a variable
    const currentRef = containerRef.current;
    const observer = new IntersectionObserver(
      async (entries, observer) => {
        if (entries[0].isIntersecting) {
          const dataURL = await getCachedThumbnail(fileEntry);
          setThumbnailURL(dataURL || null);
          // Unobserve using the captured ref value
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
      // Use the captured ref value in cleanup
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fileEntry]);

  return (
    <div ref={containerRef} style={{ width: '220px', height: '220px', margin: '0.5rem' }}>
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
