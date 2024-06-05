import '../index.css';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Devices from './screens/Devices.jsx';
import Calculator from './screens/Calculator.jsx';
import Tariffs from './screens/Tariffs.jsx';
import Navbar from './components/Navbar.jsx';

// Define a layout component that includes the Navbar
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Devices />,
      },
      {
        path: 'tariffs',
        element: <Tariffs />,
      },
      {
        path: 'calculator',
        element: <Calculator />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
