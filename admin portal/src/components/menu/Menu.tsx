// src/components/menu/Menu.tsx
//import React from 'react';
import { menu } from './data';
import MenuItem from './MenuItem';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Menu = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col gap-4">
      {menu.map((item, index) => (
        <MenuItem
          key={index}
          catalog={item.catalog}
          listItems={item.listItems}
          handleLogout={handleLogout}
        />
      ))}
    </div>
  );
};

export default Menu;