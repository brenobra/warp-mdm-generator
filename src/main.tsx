/**
 * Main entry point for the WARP MDM Generator
 */

import { render } from 'preact';
import { App } from './App';
import './index.css';

// Apply initial theme based on user preference
const isDarkMode =
  localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (isDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Render the app
render(<App />, document.getElementById('app')!);
