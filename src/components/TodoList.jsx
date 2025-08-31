import React, { useState } from "react";

export default function TodoList({ items, setItems }) {
  const [text, setText] = useState("");
  function add() {
    if (!text.trim()) return;
    setItems([...items, { text: text.trim(), done: false }]);
    setText("");
  }
  function toggle(i) {
    const copy = items.map((t, idx) => idx === i ? { ...t, done: !t.done } : t);
    setItems(copy);
  }
  function remove(i) {
    setItems(items.filter((_, idx) => idx !== i));
  }
  return (
    <>
      <h3>To-Do</h3>
      <div className="todo-add">
        <input id="todoInput" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a todo…" />
        <button id="addTodoBtn" className="btn small" onClick={add}>Add</button>
      </div>
      <ul id="todoList">
        {items.map((t, i) => (
          <li key={i} className="todo-item">
            <label className="checkbox-wrapper">
              <input type="checkbox" checked={!!t.done} onChange={() => toggle(i)} />
              <span className="checkmark"></span>
            </label>
            <span className={t.done ? "todo-text done" : "todo-text"}>{t.text}</span>
            <button onClick={() => remove(i)} className="btn tiny ghost" aria-label="Delete to-do">
              <svg className="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
