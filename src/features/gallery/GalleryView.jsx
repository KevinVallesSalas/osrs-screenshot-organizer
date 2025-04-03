// GalleryView.jsx
import React, { useState, useMemo } from 'react';
import { buildCategoryMap } from '../fileSystemAccess/classification';
import LazyThumbnail from './LazyThumbnail';
import './GalleryView.css';

function GalleryView({ fileArray }) {
  // Build the category map only when the file array changes.
  const categoryMap = useMemo(() => buildCategoryMap(fileArray), [fileArray]);

  // List of top-level categories sorted alphabetically.
  const categories = Object.keys(categoryMap).sort();

  // Sidebar selection state.
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Get subcategories for the currently selected category.
  let subcategories = [];
  if (selectedCategory) {
    subcategories = Object.keys(categoryMap[selectedCategory]).sort();
  }

  // Determine which images to display.
  let displayedImages = [];
  if (selectedCategory) {
    if (selectedSubcategory) {
      displayedImages = categoryMap[selectedCategory][selectedSubcategory] || [];
    } else {
      // If no subcategory is selected, combine all images in the category.
      displayedImages = Object.values(categoryMap[selectedCategory]).flat();
    }
  }

  return (
    <div className="gallery-view">
      {/* Sidebar with Categories */}
      <aside className="gallery-sidebar">
        <h2>Categories</h2>
        <ul>
          {categories.map((cat) => {
            const isSelected = cat === selectedCategory;
            return (
              <li key={cat} style={{ marginBottom: '0.5rem' }}>
                {/* Main category label */}
                <div
                  className={`category-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubcategory(null);
                  }}
                >
                  {cat}
                </div>

                {/* If this category is selected, show subcategories right below it */}
                {isSelected && subcategories.length > 0 && (
                  <ul className="subcat-list">
                    {subcategories.map((sub) => {
                      const subIsSelected = sub === selectedSubcategory;
                      return (
                        <li key={sub}>
                          <div
                            className={`subcategory-item ${subIsSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedSubcategory(sub)}
                          >
                            {sub}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Gallery Area */}
      <main className="gallery-gallery">
        <div className="gallery-header">
          <h2>
            {selectedCategory ? selectedCategory : 'Select a Category'}
            {selectedSubcategory ? ` > ${selectedSubcategory}` : ''}
          </h2>
        </div>
        <div className="gallery-grid">
          {displayedImages.map((fileEntry, idx) => (
            <div key={idx} className="image-card">
              <LazyThumbnail fileEntry={fileEntry} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default GalleryView;
