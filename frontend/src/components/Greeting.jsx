import React from 'react';
import greetingImage from '../assets/greeting.png';

const Greeting = () => {
  return (
    <div
      className='absolute w-full h-full bg-cover bg-center flex items-end justify-end'
      style={{ backgroundImage: `url(${greetingImage})` }}
    >
      <p className='mb-10 text-[45px] font-bold mr-10 leading-tight text-right text-white'>
        planning has never <br />
        been easier!
      </p>
    </div>
  );
};

export default Greeting;
