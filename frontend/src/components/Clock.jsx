import React, { useState, useEffect } from 'react';
import { checkAuth, dailySummary } from '../axios';

const Clock = () => {
  const [formattedTime, setFormattedTime] = useState({
    date: '',
    hourMin: '',
    period: '',
  });

  const formatTimeWithPeriod = (date) => {
    if (!(date instanceof Date)) {
      throw new Error('Invalid date object');
    }

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return {
      date: formattedDate,
      hourMin: `${formattedHours}:${formattedMinutes}`,
      period: period,
    };
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = formatTimeWithPeriod(now);
      setFormattedTime(time);
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [userLogged, setUserLogged] = useState(null);
  const [dailyTodos, setDailyTodos] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await checkAuth();
        const todoNumber = await dailySummary();
        setUserLogged(result.data.fullname);
        setDailyTodos(todoNumber.data.totalTodosDueToday);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUserLogged(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className='bg-white px-6 pb-4 pt-1 rounded-md sm:flex flex-col justify-between items-center hidden'>
      <div className='flex gap-1 items-end w-full justify-center'>
        <p className='font-bold text-[48px] m-0'>{formattedTime.hourMin}</p>
        <p className='font-bold text-lg pb-2'>{formattedTime.period}</p>
      </div>
      <p className='text-[10px] mt-[-7px]'>{formattedTime.date}</p>
      <p className='text-sm font-bold mt-3'>Welcome back, {userLogged}</p>
      <p className='text-[10px]'>
        You have <b>{dailyTodos}</b> todo{dailyTodos !== 1 ? 's' : ''} today
      </p>
    </div>
  );
};

export default Clock;
