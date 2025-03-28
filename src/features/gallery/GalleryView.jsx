import React, { useState, useMemo } from 'react';
import LazyThumbnail from './LazyThumbnail';
import './GalleryView.css';

function GalleryView({ imageFiles }) {
  // State for pagination
  const [visibleCount, setVisibleCount] = useState(20);

  // State for basic sorting
  const [sortOption, setSortOption] = useState('nameAsc');

  // Memoized sorting logic
  const sortedFiles = useMemo(() => {
    const filesCopy = [...imageFiles];
    if (sortOption === 'nameAsc') {
      filesCopy.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'nameDesc') {
      filesCopy.sort((a, b) => b.name.localeCompare(a.name));
    }
    return filesCopy;
  }, [imageFiles, sortOption]);

  // Limit the number of files displayed (pagination)
  const visibleFiles = sortedFiles.slice(0, visibleCount);

  // Handlers
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>

      {/* Sort Dropdown */}
      <div className="gallery-controls">
        <label htmlFor="sortSelect">Sort by: </label>
        <select id="sortSelect" value={sortOption} onChange={handleSortChange}>
          <option value="nameAsc">Name (A–Z)</option>
          <option value="nameDesc">Name (Z–A)</option>
        </select>
      </div>

      {/* Responsive Grid */}
      <div className="thumbnail-grid">
        {visibleFiles.map((fileEntry, index) => (
          <div className="thumbnail-item" key={index}>
            {/* LazyThumbnail handles lazy loading & caching */}
            <LazyThumbnail fileEntry={fileEntry} />

            {/* Hover overlay / optional info */}
            <div className="thumbnail-overlay">
              <span>{fileEntry.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button (if there are more images to show) */}
      {visibleCount < sortedFiles.length && (
        <button className="load-more-btn" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}

export default GalleryView;
