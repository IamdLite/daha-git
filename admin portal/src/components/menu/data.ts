// src/components/menu/data.ts
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineDocumentChartBar,
  HiOutlinePresentationChartBar,
  HiOutlineArrowLeftOnRectangle,
} from 'react-icons/hi2';

export const menu = [
  {
    catalog: 'main',
    listItems: [
      {
        isLink: true,
        url: '/home',
        icon: HiOutlineHome,
        label: 'homepage',
      },
      {
        isLink: true,
        url: '/profile',
        icon: HiOutlineUser,
        label: 'profile',
      },
    ],
  },
  {
    catalog: 'manage courses',
    listItems: [
      {
        isLink: true,
        url: '/courses',
        icon: HiOutlineDocumentChartBar,
        label: 'courses',
      },
    ],
  },
  {
    catalog: 'manage users',
    listItems: [
      {
        isLink: true,
        url: '/users',
        icon: HiOutlineUsers,
        label: 'users',
      },
    ],
  },
  {
    catalog: 'analytics',
    listItems: [
      {
        isLink: true,
        url: '/charts',
        icon: HiOutlinePresentationChartBar,
        label: 'charts',
      },
    ],
  },
  {
    catalog: 'miscellaneous',
    listItems: [
      {
        isLink: false, // Changed to false to make it a button
        icon: HiOutlineArrowLeftOnRectangle,
        label: 'log out',
        onClick: 'handleLogout' // This will be handled by the parent component
      },
    ],
  },
];