import React from 'react';
import LazyThumbnail from './LazyThumbnail';

function GalleryView({ imageFiles }) {
  return (
    <div>
      <h2>Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
        {imageFiles.map((fileEntry, index) => (
          <LazyThumbnail key={index} fileEntry={fileEntry} />
        ))}
      </div>
    </div>
  );
}

export default GalleryView;
