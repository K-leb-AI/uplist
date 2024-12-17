import React, { useState, useEffect } from 'react';
import Clock from './Clock';
import logo from '../assets/logo.png';
import logoEmblem from '../assets/logoEmblem.svg';
import CollectionTile from './CollectionTile';
import { getCollections, logout } from '../axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CollectionModal from './CollectionModal';

const Menubar = ({ setActive, activeCollection, searchData }) => {
  const navigate = useNavigate();
  const [allCollections, setAllCollections] = useState([]);

  // Handle logout logic
  const handleLogout = async () => {
    try {
      const result = await logout();
      toast.success(result.message || 'Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  // Fetch all collections on component mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const result = await getCollections();
        setAllCollections(result?.data?.collections || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
        toast.error('Failed to load collections. Please refresh.');
      }
    };
    fetchCollections();
  }, []);

  return (
    <aside className='h-full w-full min-w-20 top-0 left-0 relative bg-gray-100 lg:px-6 py-3 px-3 border-r border-gray-200'>
      <div className='flex flex-col h-full justify-between items-center'>
        <div className='w-full'>
          {/* Logo */}
          <img
            src={logo}
            alt='Logo'
            className='sm:block hidden w-1/4 my-3 mx-auto mb-5'
          />
          <img
            src={logoEmblem}
            alt='Logo Emblem'
            className='sm:hidden w-1/2 my-3 mb-2 mx-auto'
          />
          <Clock />
          <br />

          {/* Collections Header */}
          <div className='flex justify-between items-center mb-2'>
            <p className='text-md font-bold hidden sm:block'>Collections</p>
            <CollectionModal onAddCollection={setAllCollections} />
          </div>

          {/* Collections List */}
          <div className='flex flex-col gap-1 h-[80%] sm:max-h-[200px] overflow-y-scroll scrollbar-custom w-[103%]'>
            {allCollections.length > 0 ? (
              allCollections.map((collection) => (
                <CollectionTile
                  key={collection._id}
                  collectionName={collection.name}
                  collectionId={collection._id}
                  onDeleteCollection={setAllCollections}
                  onClick={() => {
                    setActive(collection._id);
                  }}
                  active={activeCollection === collection._id}
                  searchData={searchData}
                />
              ))
            ) : (
              <p className='text-xs flex justify-center items-center text-gray-400 mt-2'>
                No Collections here
              </p>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div
          className='relative w-full bg-red-400 sm:bg-gray-200 hover:bg-red-400 hover:text-white transition-all cursor-pointer rounded-md text-white sm:text-black text-xs flex justify-center items-center py-[10px]'
          onClick={handleLogout}
        >
          <div className='flex gap-1 justify-center items-center'>
            <i className='fa-solid fa-right-from-bracket sm:hidden text-xs'></i>
            <p className='hidden sm:block'>Logout</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Menubar;
