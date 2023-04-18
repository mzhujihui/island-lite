import { createRoot } from 'react-dom/client';
import { App } from './App';
import siteData from 'virtual:island-site-data';

function renderInBrowser() {
  console.log(1111, siteData);
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(<App />);
}

renderInBrowser();
