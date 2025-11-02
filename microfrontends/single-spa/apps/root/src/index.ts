import { mountVercelToolbar } from '@vercel/toolbar/vite';
import { registerApplication, start } from 'single-spa';
import './globals.css';

// The header and footer are defined within the root.
registerApplication(
  'header',
  () => import('./header'),
  () => true,
);

registerApplication(
  'footer',
  () => import('./footer'),
  () => true,
);

// The content application is defined in the content microfrontend.
registerApplication(
  'content',
  () => import('content/landing'),
  () => true,
);

start();
mountVercelToolbar();
