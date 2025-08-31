import React, { useState, useEffect, useRef } from 'react';

function Quote() {
  const [quote, setQuote] = useState("Huh, Great Job! Doing right keep going.");
  const [isEditing, setIsEditing] = useState(false);
  const quoteRef = useRef(null);
  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (panelRef.current && position === null) {
      const panelWidth = panelRef.current.offsetWidth;
      const panelHeight = panelRef.current.offsetHeight;
      setPosition({
        x: (window.innerWidth - panelWidth) / 2,
        y: (window.innerHeight - panelHeight) / 2,
      });
    }
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (isEditing && quoteRef.current) {
      quoteRef.current.focus();
      // Place cursor at the end of the text
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(quoteRef.current);
      range.collapse(false); // false collapses to the end
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [isEditing]);

  const handleBlur = () => {
    if (quoteRef.current) {
      setQuote(quoteRef.current.innerText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent Enter from creating a new line
      quoteRef.current.blur(); // Triggers handleBlur
    } else if (e.key === 'Escape') {
      quoteRef.current.innerText = quote; // Revert changes
      setIsEditing(false);
    }
  };

  const handleMouseDown = (e) => {
    if (isEditing || e.target.isContentEditable) return;
    const panel = panelRef.current;
    if (panel) {
      setIsDragging(true);
      const panelRect = panel.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - panelRect.left,
        y: e.clientY - panelRect.top,
      };
      e.preventDefault();
    }
  };

  return (
    <div
      ref={panelRef}
      className={`center panel ${isDragging ? 'dragging' : ''}`}
      style={position ? { left: `${position.x}px`, top: `${position.y}px` } : {}}
      onMouseDown={handleMouseDown}>
      <blockquote
        ref={quoteRef}
        className={isEditing ? 'editing' : ''}
        onClick={() => setIsEditing(true)}
        onBlur={handleBlur}
        onKeyDown={isEditing ? handleKeyDown : undefined}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
      >
        {quote}
      </blockquote>
    </div>
  );
}

export default Quote;
