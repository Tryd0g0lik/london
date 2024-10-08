import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PagesFC } from './components/Pages'
import './App.css';
import './index.css';


const root = document.getElementById('root');

if (!root) {
  throw new Error('[App]: Something what woong! It is an id "root" was not found ');
}
createRoot(root).render(
  <StrictMode>
    <PagesFC />
  </StrictMode>
);

console.log('Good lack work');

