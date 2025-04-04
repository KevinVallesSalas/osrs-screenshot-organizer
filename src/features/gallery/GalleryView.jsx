// GalleryView.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { buildCategoryMapCached } from '../fileSystemAccess/classification';
import { formatDate12hr } from '../../utils/dateUtils';
import LazyThumbnail from './LazyThumbnail';
import './GalleryView.css';

function GalleryView({ fileArray }) {
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    async function fetchCategoryMap() {
      const map = await buildCategoryMapCached(fileArray);
      setCategoryMap(map);
    }
    fetchCategoryMap();
  }, [fileArray]);

  const categories = useMemo(() => Object.keys(categoryMap).sort(), [categoryMap]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const subcategories = useMemo(() => {
    if (selectedCategory) {
      return Object.keys(categoryMap[selectedCategory]).sort();
    }
    return [];
  }, [selectedCategory, categoryMap]);

  const displayedImages = useMemo(() => {
    if (selectedCategory) {
      if (selectedSubcategory) {
        return categoryMap[selectedCategory][selectedSubcategory] || [];
      }
      return Object.values(categoryMap[selectedCategory]).flat();
    }
    return [];
  }, [selectedCategory, selectedSubcategory, categoryMap]);

  const [sortOption, setSortOption] = useState("dateAsc");

  const sortedImages = useMemo(() => {
    const imagesCopy = [...displayedImages];
  
    imagesCopy.sort((a, b) => {
      const dateA = a.dateStr ? new Date(a.dateStr) : new Date(0);
      const dateB = b.dateStr ? new Date(b.dateStr) : new Date(0);
      return sortOption === "dateAsc" ? dateA - dateB : dateB - dateA;
    });
  
    return imagesCopy;
  }, [displayedImages, sortOption]);

  return (
    <div className="gallery-view">
      <aside className="gallery-sidebar">
        <h2>Categories</h2>
        <ul className="sidebar-categories">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory(null);
              }}
              className={cat === selectedCategory ? "selected" : ""}
            >
              {cat}
              {cat === selectedCategory && subcategories.length > 0 && (
                <ul className="sidebar-subcategories">
                  {subcategories.map((sub) => (
                    <li
                      key={sub}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubcategory(sub);
                      }}
                      className={sub === selectedSubcategory ? "selected" : ""}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <main className="gallery-gallery">
        <div className="gallery-header">
          <h2>
            {selectedCategory ? selectedCategory : 'Select a Category'}
            {selectedSubcategory ? ` > ${selectedSubcategory}` : ''}
          </h2>
          <div className="sort-controls">
            <label htmlFor="sortSelect">Sort by Date:</label>
            <select
              id="sortSelect"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="dateAsc">Oldest</option>
              <option value="dateDesc">Newest</option>
            </select>
          </div>
        </div>

        <div className="gallery-grid">
          {sortedImages.map((imgInfo, idx) => (
            <div key={idx} className="image-card">
              <LazyThumbnail fileEntry={imgInfo.fileEntry} />
              <div className="image-date">
                {imgInfo.dateStr ? formatDate12hr(new Date(imgInfo.dateStr)) : 'No Date'}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default GalleryView;
