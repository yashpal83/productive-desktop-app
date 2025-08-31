import React, { useState, useEffect, useRef } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';

function Wallpaper() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const imageStock = [
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1920', // forest path
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1920', // lake and mountains
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1920', // waterfall
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920', // mountain range
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920', // green hills and river
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920', // green field
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920', // misty forest
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1920', // beach at sunrise
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?q=80&w=1920', // sun through trees
    'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?q=80&w=1920'  // lake with mountains reflection
  ];

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const setRandomWallpaper = () => {
    const wallpaperContainer = document.getElementById('app');
    if (wallpaperContainer) {
      const randomIndex = Math.floor(Math.random() * imageStock.length);
      const randomImageUrl = imageStock[randomIndex];
      wallpaperContainer.style.backgroundImage = `url('${randomImageUrl}')`;
    }
    setMenuVisible(false);
  };

  const setWallpaperFromLink = () => {
    if (!imageUrl) return;

    try {
      // The previous regex was too strict for modern image URLs (e.g., from Unsplash)
      // that often don't have file extensions or have query parameters.
      // This validation is more robust by checking if it's a valid URL.
      new URL(imageUrl);
      const wallpaperContainer = document.getElementById('app');
      if (wallpaperContainer) {
        wallpaperContainer.style.backgroundImage = `url('${imageUrl}')`;
      }
      setImageUrl('');
      setMenuVisible(false);
    } catch (error) {
      alert('Please enter a valid image URL.');
    }
  };

  const setWallpaperFromFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Images',
          extensions: ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']
        }]
      });

      if (selected && !Array.isArray(selected)) {
        const assetUrl = convertFileSrc(selected);
        const wallpaperContainer = document.getElementById('app');
        if (wallpaperContainer) {
          wallpaperContainer.style.backgroundImage = `url('${assetUrl}')`;
        }
        setMenuVisible(false);
      }
    } catch (err) {
      console.error("Error selecting file:", err);
      alert("Could not load the selected image. Please make sure it's a valid image file.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setWallpaperFromLink();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="wallpaper-edit-container">
      <button ref={buttonRef} id="edit-wallpaper-btn" className="edit-wallpaper-btn" title={menuVisible ? 'Close menu' : 'Change wallpaper'} onClick={toggleMenu}>
        {menuVisible ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </button>

      {menuVisible && (
        <div ref={menuRef} id="wallpaper-menu" className="wallpaper-menu">
          <button id="surprise-me-btn" onClick={setRandomWallpaper}>Surprise Me</button>
          <button id="from-computer-btn" onClick={setWallpaperFromFile}>From Computer</button>
          <div className="paste-link-container">
            <input type="text" id="wallpaper-link-input" placeholder="Paste image URL..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={handleKeyDown} />
            <button id="set-wallpaper-btn" onClick={setWallpaperFromLink}>Set</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallpaper;