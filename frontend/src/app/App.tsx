import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { seedData } from '../data/seed';

export function App() {
  useEffect(() => {
    seedData();
  }, []);
  return <RouterProvider router={router} />;
}
