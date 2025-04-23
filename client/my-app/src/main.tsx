import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import  { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// const router = createBrowserRouter([
//   { path: '/', element: <App /> },
//   // { path: '/login', element: <App /> },
//   { path: '/register', element: <App /> },
//   // { path: '*', element: <NotFoundPage /> },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
