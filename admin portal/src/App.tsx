// src/App.tsx
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  ScrollRestoration,
} from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Menu from './components/menu/Menu';
import Error from './pages/Error';
import Profile from './pages/Profile';
import Posts from './pages/Courses';
import Charts from './pages/Charts';
import ToasterProvider from './components/ToasterProvider';
import EditProfile from './pages/EditProfile';
import Login from './pages/Login';

// Authentication functions
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  // Remove any other auth-related items
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('email');
  // You might also want to clear any tokens if using JWT
  // localStorage.removeItem('token');
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Layout component for protected routes
const AppLayout = () => {
  return (
    <div
      id="rootContainer"
      className="w-full p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between"
    >
      <ToasterProvider />
      <ScrollRestoration />
      <div>
        <Navbar />
        <div className="w-full flex gap-0 pt-20 xl:pt-[96px] 2xl:pt-[112px] mb-auto">
          <div className="hidden xl:block xl:w-[250px] 2xl:w-[280px] 3xl:w-[350px] border-r-2 border-base-300 dark:border-slate-700 px-3 xl:px-4 xl:py-1">
            <Menu />
          </div>
          <div className="w-full px-4 xl:px-4 2xl:px-5 xl:py-2 overflow-clip">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: '/home',
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: '/profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: '/profile/edit',
          element: (
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: '/users',
          element: (
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          ),
        },
        {
          path: '/courses',
          element: (
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          ),
        },
        {
          path: '/charts',
          element: (
            <ProtectedRoute>
              <Charts />
            </ProtectedRoute>
          ),
        },
      ],
      errorElement: <Error />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;