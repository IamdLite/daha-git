import React from 'react';
import { menu } from './data';
import MenuItem from './MenuItem';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../App';
import toast from 'react-hot-toast';

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-5">
        {menu.map((item, index) => (
          <MenuItem
            key={index}
            catalog={item.catalog}
            listItems={item.listItems}
            handleLogout={handleLogout}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;