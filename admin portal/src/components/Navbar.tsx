// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiSearch, HiOutlineBell } from 'react-icons/hi';
import { HiBars3CenterLeft } from 'react-icons/hi2';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import ChangeThemes from './ChangesThemes';
import toast from 'react-hot-toast';
import { menu } from './menu/data';
import MenuItem from './menu/MenuItem';
import logo from '../assets/daha-logo.png';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isFullScreen, setIsFullScreen] = React.useState(false); // Initialize to false
  const element = document.getElementById('root');
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

  const toggleFullScreen = () => {
    if (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    ) {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.error('Failed to exit fullscreen:', err));
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen().catch((err: any) => console.error('Failed to exit fullscreen:', err));
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen().catch((err: any) => console.error('Failed to exit fullscreen:', err));
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen().catch((err: any) => console.error('Failed to exit fullscreen:', err));
      }
      setIsFullScreen(false);
    } else {
      // Enter fullscreen
      if (element?.requestFullscreen) {
        element.requestFullscreen({ navigationUI: 'auto' }).catch((err) => console.error('Failed to enter fullscreen:', err));
      } else if ((element as any)?.webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen().catch((err: any) => console.error('Failed to enter fullscreen:', err));
      } else if ((element as any)?.mozRequestFullScreen) {
        (element as any).mozRequestFullScreen().catch((err: any) => console.error('Failed to enter fullscreen:', err));
      } else if ((element as any)?.msRequestFullscreen) {
        (element as any).msRequestFullscreen().catch((err: any) => console.error('Failed to enter fullscreen:', err));
      }
      setIsFullScreen(true);
    }
  };

  React.useEffect(() => {
    // Sync fullscreen state
    const handleFullScreenChange = () => {
      setIsFullScreen(
        !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed z-[3] top-0 left-0 right-0 bg-base-100 w-full flex justify-between px-3 xl:px-4 py-3 xl:py-5 gap-4 xl:gap-0">
      {/* Left side - menu and logo */}
      <div className="flex gap-3 items-center">
        {/* Mobile drawer */}
        <div className="drawer w-auto p-0 mr-1 xl:hidden">
          <input
            id="drawer-navbar-mobile"
            type="checkbox"
            className="drawer-toggle"
            checked={isDrawerOpen}
            onChange={toggleDrawer}
          />
          <div className="p-0 w-auto drawer-content">
            <label htmlFor="drawer-navbar-mobile" className="p-0 btn btn-ghost drawer-button">
              <HiBars3CenterLeft className="text-2xl" />
            </label>
          </div>
          <div className="drawer-side z-[99]">
            <label htmlFor="drawer-navbar-mobile" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="menu p-4 w-auto min-h-full bg-base-200 text-base-content">
              <Link to={'/home'} className="flex items-center gap-1 xl:gap-2 mt-1 mb-5">
                <img src={logo} alt="DAHA Logo" className="h-8 text-primary" />
                <span className="text-[16px] leading-[1.2] sm:text-lg xl:text-xl 2xl:text-2xl font-semibold text-base-content dark:text-neutral-200">
                  DAHA Admin Portal
                </span>
              </Link>
              {menu.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={toggleDrawer}
                  catalog={item.catalog}
                  listItems={item.listItems}
                  handleLogout={handleLogout}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Logo - visible on all screens */}
        <Link to={'/home'} className="flex items-center gap-1 xl:gap-2">
          <img src={logo} alt="DAHA Logo" className="h-8 sm:h-10 xl:h-12 2xl:h-14 w-auto" />
        </Link>
      </div>

      {/* Right side - navigation items */}
      {isAuthenticated && (
        <div className="flex items-center gap-0 xl:gap-1 2xl:gap-2 3xl:gap-5">
          {/* Search */}
          <button
            onClick={() => toast('Nice to have right ?!', { icon: '😠' })}
            className="hidden sm:inline-flex btn btn-circle btn-ghost"
          >
            <HiSearch className="text-xl 2xl:text-2xl 3xl:text-3xl" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullScreen}
            className="hidden xl:inline-flex btn btn-circle btn-ghost"
          >
            {isFullScreen ? (
              <RxExitFullScreen className="xl:text-xl 2xl:text-2xl 3xl:text-3xl" />
            ) : (
              <RxEnterFullScreen className="xl:text-xl 2xl:text-2xl 3xl:text-3xl" />
            )}
          </button>

          {/* Notification */}
          <button
            onClick={() => toast('Nice to have, right ?', { icon: '😠' })}
            className="px-0 xl:px-auto btn btn-circle btn-ghost"
          >
            <HiOutlineBell className="text-xl 2xl:text-2xl 3xl:text-3xl" />
          </button>

          {/* Theme */}
          <div className="px-0 xl:px-auto btn btn-circle btn-ghost xl:mr-1">
            <ChangeThemes />
          </div>

          {/* Avatar dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full">
                <img
                  src={user?.photo_url || 'https://avatars.githubusercontent.com/u/74099030?v=4'}
                  alt="User profile"
                />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-40">
              <li>
                <Link to="/profile" className="justify-between">
                  {user?.username || 'My Profile'}
                </Link>
              </li>
              <li>
                <a onClick={handleLogout}>Log Out</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;