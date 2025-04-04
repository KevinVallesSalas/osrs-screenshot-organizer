import React, { useState, useRef, useEffect } from 'react';
import { getCachedThumbnail } from './thumbnailCache';

function LazyThumbnail({ fileEntry }) {
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const currentRef = containerRef.current;
    const observer = new IntersectionObserver(
      async (entries, observer) => {
        if (entries[0].isIntersecting) {
          let url = await getCachedThumbnail(fileEntry);
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
          alt="thumbnail"
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
    </div>
  );
}

export default LazyThumbnail;