import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

console.log('App initialization starting...');

try {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root container not found');
  
  const root = createRoot(container);
  root.render(
    <HashRouter>
      <App />
    </HashRouter>
  );
  console.log('App render called successfully');
} catch (e) {
  console.error('Render crash:', e);
  const body = document.body;
  if (body) {
    body.innerHTML = `<div style="padding: 20px; color: red;">レンダリングエラーが発生しました: ${e}</div>`;
  }
}