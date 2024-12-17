import React from 'react';
import Menubar from '../components/Menubar';
import SearchBar from '../components/SearchBar';
import Details from '../components/Details.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchData, setSearchData] = useState([]);
  const [activeTodo, setActiveTodo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCollection !== null)
      navigate(`/dashboard/${selectedCollection}`);
  }, [selectedCollection, searchData, activeTodo]);

  return (
    <div className='relative h-screen w-screen grid lg:grid-cols-[23%_54%_23%] sm:grid-cols-[30%_70%] grid-cols-[20%_80%] overflow-x-hidden'>
      <Menubar
        setActive={setSelectedCollection}
        activeCollection={selectedCollection}
      />
      <SearchBar
        searchArray={searchData}
        setSearchArray={setSearchData}
        setActiveTodo={setActiveTodo}
        activeTodo={activeTodo}
      />
      <Details activeTodo={activeTodo} setActiveTodo={setActiveTodo} />
    </div>
  );
};

export default Dashboard;