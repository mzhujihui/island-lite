import { createRoot } from 'react-dom/client';
import { App } from './App';
import siteData from 'virtual:island-site-data';
import { BrowserRouter } from 'react-router-dom';

function renderInBrowser() {
  console.log('配置文件', siteData);
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

renderInBrowser();
