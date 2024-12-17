import React, { useState, useEffect } from 'react';
import { getTodosInCollection, getOneCollection } from '../axios';
import { useParams } from 'react-router-dom';
import CustomTable from './Table';
import TodoModal from './TodoModal';

const SearchBar = ({ activeTodo, setActiveTodo }) => {
  const [searchString, setSearchString] = useState('');
  const [searchData, setSearchData] = useState([]);
  const params = useParams();
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const result = await getTodosInCollection(params.collectionId);
        setSearchData(result.data.todos); // Update the data without filtering
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };
    fetchTodos();

    const getCollection = async () => {
      try {
        const result = await getOneCollection(params.collectionId);
        setCollectionName(result.data.collection.name);
      } catch (error) {
        console.log(error);
      }
    };
    getCollection();
  }, [params.collectionId, setSearchData]);

  const filteredData = searchData.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchString.toLowerCase()) ||
      item.description.toLowerCase().includes(searchString.toLowerCase())
    );
  });

  return (
    <div className='grid sm:grid-rows-[13%_87%] grid-rows-[8%_91%] max-h-screen '>
      <div className='flex h-full relative w-full max-h-[72px] bg-gray-100 p-2 sm:p-3 border-b border-gray-200 gap-2'>
        <input
          onChange={(e) => setSearchString(e.target.value)}
          type='text'
          value={searchString}
          className='w-full h-full px-5 rounded-md text-sm focus:outline-none placeholder:text-gray-300 placeholder:text-xs'
          placeholder='Search for a todo'
        />
      </div>
      <div className='flex flex-col p-3 h-full overflow-y-scroll scrollbar-custom'>
        <div className='flex justify-between items-center mb-2'>
          <div className='p-2 text-md font-bold'>{collectionName}</div>
          <TodoModal
            collectionId={params.collectionId}
            setDataArray={setSearchData}
          />
        </div>
        <CustomTable
          dataArray={filteredData}
          activeTodo={activeTodo}
          setActiveTodo={setActiveTodo}
        />
      </div>
    </div>
  );
};

export default SearchBar;
