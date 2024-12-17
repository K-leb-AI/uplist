import React, { useEffect, useState } from 'react';
import {
  deleteCollection,
  getCollections,
  getTodosInCollection,
} from '../axios';
import toast from 'react-hot-toast';

const CollectionTile = ({
  collectionName,
  collectionId,
  onDeleteCollection,
  onClick,
  active,
}) => {
  const [incompleteCount, setIncompleteCount] = useState(0);
  const handleDelete = async () => {
    try {
      const result = await deleteCollection(collectionId);
      toast.success(result.data.message);
      const getResult = await getCollections();
      onDeleteCollection(getResult.data.collections);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleCount = async (id) => {
      try {
        const result = await getTodosInCollection(id);
        const todos = result?.data?.todos || [];
        setIncompleteCount(todos.filter((item) => !item.isCompleted).length);
      } catch (error) {
        console.error(`Error fetching todos for collection ${id}:`, error);
      }
    };
    handleCount(collectionId);
  });

  return (
    <div
      className={`sm:w-[98.5%] w-full px-3 py-2 aspect-square rounded-md flex justify-center sm:justify-between sm:aspect-auto items-center cursor-pointer  transition-all ${
        active
          ? 'bg-gray-700 text-white hover:bg-gray-600'
          : 'bg-gray-200 text-black hover:bg-gray-300'
      }`}
      onClick={onClick}
    >
      <p className='text-xs hidden sm:block'>
        {collectionName.length > 25
          ? `${collectionName.slice(0, 25)}...`
          : collectionName}
      </p>
      <p></p>
      <div className='flex gap-2 items-center'>
        <p
          className={`text-sm sm:text-xs rounded-full w-8 aspect-square sm:w-4 flex justify-center items-center ${
            incompleteCount === 0
              ? 'bg-gray-100 text-black'
              : 'bg-blue-500 text-white'
          }`}
        >
          {incompleteCount}
        </p>
        <div className='hidden sm:block'>
          <i
            className='fa-solid fa-trash text-gray-400 text-sm hover:text-red-300 transition-all'
            onClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionTile;
