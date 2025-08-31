import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the Todo component
import Todo from './components/Todo';
// Import the new Priorities component
import Priorities from './components/Priorities';
// Import the Quote component
import Quote from './components/Quote';
// Import the new Wallpaper component
import Wallpaper from './components/Wallpaper';

// It's a good practice to import your main stylesheet in your entry file.
import './style.css';

// The main App component now lays out all the widgets.
function App() {
  return (
    <>
      <Priorities />
      <Quote />
      <Todo />
      <Wallpaper />
    </>
  );
}

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element with id 'app'");
}