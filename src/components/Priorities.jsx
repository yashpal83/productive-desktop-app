import React, { useState, useEffect, useRef } from 'react';

function Priorities() {
  const [priorities, setPriorities] = React.useState([
    'Reading',
    'Writing',
    'Exercise',
    'Meditation',
  ]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [originalValue, setOriginalValue] = useState('');
  const itemRefs = useRef([]);
  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial position based on its original CSS.
    if (panelRef.current && position === null) {
      // --safe-pad is 28px
      setPosition({
        x: 28,
        y: 80,
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
    if (editingIndex !== null && itemRefs.current[editingIndex]) {
      const node = itemRefs.current[editingIndex];
      node.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(node);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [editingIndex]);

  const handlePriorityChange = (index, newValue) => {
    const updatedPriorities = [...priorities];
    updatedPriorities[index] = newValue;
    setPriorities(updatedPriorities);
  };

  const handleAddPriority = () => {
    const newPriorities = [...priorities, ''];
    setPriorities(newPriorities);
    setEditingIndex(newPriorities.length - 1);
    setOriginalValue('');
  };

  const handleDeletePriority = (indexToDelete) => {
    setPriorities(priorities.filter((_, index) => index !== indexToDelete));
  };

  const handleEditStart = (index, value) => {
    setEditingIndex(index);
    setOriginalValue(value);
  };

  const handleBlur = (index, e) => {
    handlePriorityChange(index, e.target.innerText);
    setEditingIndex(null);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    } else if (e.key === 'Escape') {
      e.target.innerText = originalValue;
      setEditingIndex(null);
    }
  };

  const handleMouseDown = (e) => {
    // Do not drag if clicking on a button or editable text
    if (e.target.isContentEditable || e.target.closest('button')) {
      return;
    }
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
    <div ref={panelRef} className={`panel left ${isDragging ? 'dragging' : ''}`} style={position ? { left: `${position.x}px`, top: `${position.y}px` } : {}} onMouseDown={handleMouseDown}>
      <div className="panel-heading">
        <h3>Top Priorities</h3>
        <button className="btn small" onClick={handleAddPriority}>
          Add
        </button>
      </div>
      <div className="container">
        {priorities.map((priority, index) => (
          <div className="list-item" key={index}>
            <div className="bullet"></div>
            <div
              ref={(el) => (itemRefs.current[index] = el)}
              className={`priority-text ${editingIndex === index ? 'editing' : ''}`}
              contentEditable={editingIndex === index}
              suppressContentEditableWarning={true}
              onClick={() => editingIndex !== index && handleEditStart(index, priority)}
              onBlur={(e) => handleBlur(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}>
              {priority}
            </div>
            <button
              className="btn ghost tiny"
              onClick={() => handleDeletePriority(index)}
              aria-label="Delete priority"
            >
              <svg className="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Priorities;