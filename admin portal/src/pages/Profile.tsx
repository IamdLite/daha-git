// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authenticatedFetch } from '../api/auth';

interface Grade {
  id: number;
  level: number;
}

interface SavedFilters {
  category_id: number;
  level: string;
  grade: Grade;
}

interface UserData {
  id: number;
  username: string;
  notifications: string;
  role: string;
  saved_filters: SavedFilters;
  created_at: string;
}

const Profile = () => {
  const modalDelete = React.useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, accessToken, user, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      authenticatedFetch('https://daha.linkpc.net/api/users/me', {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(
              `Failed to fetch user data: ${response.status} ${response.statusText} - ${errorText}`
            );
          }
          return response.json();
        })
        .then((data: UserData) => setUserData(data))
        .catch((err) => {
          console.error('Fetch error:', err);
          setError(err.message);
          if (err.message.includes('401') || err.message.includes('403')) {
            logout();
            navigate('/login', { replace: true });
            toast.error('Session expired. Please log in again.');
          }
        });
    } else {
      setError('No authentication token available');
    }
  }, [isAuthenticated, accessToken, logout, navigate]);

  const handleDeleteAccount = async () => {
    try {
      const response = await authenticatedFetch('https://daha.linkpc.net/api/user/delete', {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      toast.success('Account deleted successfully');
      logout();
      navigate('/login', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
    }
    modalDelete.current?.close();
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return <div className="text-error text-center">{error}</div>;
  }

  // Fallback to JWT user data if API data is unavailable
  const displayData = userData || {
    id: user?.sub ? parseInt(user.sub) : 0,
    username: user?.username || 'Unknown',
    notifications: 'unknown',
    role: user?.role || 'User',
    saved_filters: {
      category_id: 0,
      level: 'Unknown',
      grade: { id: 0, level: 0 },
    },
    created_at: new Date().toISOString(),
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-10 xl:gap-8">
        {/* block 1 */}
        <div className="flex items-start justify-between">
          <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
            My Profile
          </h2>
          <button
            onClick={() => navigate('/profile/edit')}
            className="btn text-xs xl:text-sm dark:btn-neutral"
          >
            <HiOutlinePencil className="text-lg" /> Edit My Profile
          </button>
        </div>
        {/* block 2 */}
        <div className="flex items-center gap-3 xl:gap-8 xl:mb-4">
          <div className="avatar">
            <div className="w-24 xl:w-36 2xl:w-48 rounded-full">
              <img
                src={user?.photo_url || 'https://avatars.githubusercontent.com/u/74099030?v=4'}
                alt="User profile"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-semibold text-xl xl:text-3xl">{displayData.username}</h3>
            <span className="font-normal text-base">{displayData.role}</span>
          </div>
        </div>
        {/* block 3 */}
        <div className="w-full flex flex-col items-stretch gap-3 xl:gap-7">
          <div className="flex items-center w-full gap-3 xl:gap-5">
            <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
              Basic Information
            </h4>
            <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
          </div>
          <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-5 xl:gap-5 xl:text-base">
            <div className="w-full grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col items-start xl:gap-5">
                <span>Username</span>
                <span>Role</span>
                <span>Notifications</span>
              </div>
              <div className="col-span-2 flex flex-col items-start xl:gap-5">
                <span className="font-semibold">{displayData.username}</span>
                <span className="font-semibold">{displayData.role}</span>
                <span className="font-semibold">{displayData.notifications}</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col items-start xl:gap-5">
                <span>Created At</span>
                <span>Saved Filters</span>
              </div>
              <div className="col-span-2 flex flex-col items-start xl:gap-5">
                <span className="font-semibold">
                  {new Date(displayData.created_at).toLocaleString()}
                </span>
                <span className="font-semibold">
                  {displayData.saved_filters.level} (Category: {displayData.saved_filters.category_id})
                </span>
              </div>
            </div>
            <div className="w-full grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col items-start xl:gap-5">
                <span>Password</span>
              </div>
              <div className="col-span-2 flex flex-col items-start xl:gap-5">
                <span className="link no-underline link-primary font-semibold">
                  Change Password
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start items-center mt-10">
          <button
            className="btn dark:btn-neutral text-error dark:text-error text-xs xl:text-sm"
            onClick={() => modalDelete.current?.showModal()}
          >
            <HiOutlineTrash className="text-lg" />
            Delete My Account
          </button>
          <dialog id="modal_delete" className="modal" ref={modalDelete}>
            <div className="modal-box">
              <h3 className="font-bold text-lg dark:text-white">Action Confirmation!</h3>
              <p className="py-4">Do you want to delete your account?</p>
              <div className="modal-action mx-0 flex-col items-stretch justify-stretch gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="btn btn-error btn-block text-base-100 dark:text-white"
                >
                  Yes, I want to delete my account
                </button>
                <form method="dialog" className="m-0 w-full">
                  <button className="m-0 btn btn-block dark:btn-neutral">
                    No, I don't think so
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Profile;