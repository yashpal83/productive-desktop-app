import React, { useState, useEffect, useRef } from 'react';

function Todo() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review project specifications', done: true },
    { id: 2, text: 'Deploy to staging environment', done: false },
    { id: 3, text: 'Update documentation', done: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial position based on its original CSS.
    if (panelRef.current && position === null) {
      const panelWidth = panelRef.current.offsetWidth;
      const safePad = 28; // --safe-pad value from CSS
      setPosition({
        x: window.innerWidth - panelWidth - safePad,
        y: 80, // top value from CSS
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

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, done: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleMouseDown = (e) => {
    // Do not drag if clicking on an input, button, or checkbox
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('.checkbox-wrapper')) {
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
    <div ref={panelRef} className={`panel right ${isDragging ? 'dragging' : ''}`} style={position ? { left: `${position.x}px`, top: `${position.y}px` } : {}} onMouseDown={handleMouseDown}>
      <div className="panel-heading">
        <h3>To-do List</h3>
      </div>
      <form className="todo-add" onSubmit={handleAddTodo}>
        <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new to-do..." />
        <button type="submit" className="btn small">Add</button>
      </form>
      <div className="container">
        {todos.map(todo => (
          <div key={todo.id} className="list-item">
            <label className="checkbox-wrapper">
              <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
              <span className="checkmark"></span>
            </label>
            <div className={`priority-text ${todo.done ? 'done' : ''}`}>{todo.text}</div>
            <button className="btn ghost tiny" onClick={() => deleteTodo(todo.id)} aria-label="Delete to-do">
              <svg className="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todo;