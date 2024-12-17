import React, { useEffect, useState } from 'react';
import { updateTodo } from '../axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import waitingSvg from '../assets/waiting.svg';

const Details = ({ activeTodo, setActiveTodo }) => {
  const params = useParams();
  const [isEditable, setIsEditable] = useState(false); // State to toggle editability

  // Handles title changes
  const handleTitleChange = (e) => {
    setActiveTodo({ ...activeTodo, title: e.target.value });
  };

  // Handles description changes
  const handleDescriptionChange = (e) => {
    setActiveTodo({ ...activeTodo, description: e.target.value });
  };

  // Handles due date changes
  const handleDateChange = (e) => {
    setActiveTodo({ ...activeTodo, due: e.target.value });
  };

  // Toggles edit mode
  const toggleEdit = async () => {
    try {
      if (isEditable == true) {
        await updateTodo(activeTodo._id, params.collectionId, {
          title: activeTodo.title,
          description: activeTodo.description,
          due: activeTodo.due,
        });
        toast.success('Todo saved');
      }
      setIsEditable(!isEditable);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <aside className='hidden lg:block h-screen w-full top-0 right-0 relative bg-gray-100 px-6 py-3 border-l border-gray-200'>
      {activeTodo.initial == false ? (
        <div className='flex flex-col justify-between items-center w-full h-full'>
          <div className='w-full'>
            <div className='py-2 text-md mb-3 font-bold'>Todo Details</div>
            {/* Todo Title */}
            <form action='' className='w-full'>
              <div className='flex flex-col gap-1 mb-2 w-full'>
                <label
                  htmlFor='todoName'
                  className='text-xs block mb-1 font-medium'
                >
                  Todo title
                </label>
                <input
                  name='todoName'
                  onChange={handleTitleChange}
                  value={activeTodo?.title || ''} // Fallback to an empty string
                  type='text'
                  className='bg-white w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-xs placeholder:text-xs'
                  placeholder='Enter todo title'
                  disabled={!isEditable} // Toggle based on edit mode
                />
              </div>

              {/* Todo Description */}
              <div className='flex flex-col gap-1 mb-2 w-full'>
                <label
                  htmlFor='todoDescription'
                  className='text-xs block mb-1 font-medium'
                >
                  Description
                </label>
                <textarea
                  name='todoDescription'
                  onChange={handleDescriptionChange}
                  value={activeTodo?.description || ''} // Fallback to an empty string
                  className='bg-white w-full p-2 rounded-md border border-slate-200 h-40 focus:border-slate-300 focus:outline-none text-xs placeholder:text-xs'
                  placeholder='Describe your task'
                  disabled={!isEditable} // Toggle based on edit mode
                />
              </div>

              {/* Todo Due Date */}
              <div className='flex flex-col gap-1 mb-2 w-full'>
                <label
                  htmlFor='todoDue'
                  className='text-xs block mb-1 font-medium'
                >
                  Due date
                </label>
                <input
                  name='todoDue'
                  onChange={handleDateChange}
                  value={activeTodo?.due ? activeTodo.due.slice(0, 10) : ''} // Format date to YYYY-MM-DD
                  type='date'
                  className='bg-white w-full p-2 rounded-md border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none text-xs'
                  disabled={!isEditable} // Toggle based on edit mode
                />
              </div>
            </form>
          </div>
          <div
            className='relative w-full bg-gray-400 sm:bg-gray-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer rounded-md text-white sm:text-black text-xs flex justify-center items-center py-[10px]'
            onClick={toggleEdit} // Toggle edit mode on click
          >
            <div className='flex gap-1 justify-center items-center'>
              <i className='fa-solid fa-pen-to-square sm:hidden text-xs'></i>
              <p className='hidden sm:block'>{isEditable ? 'Save' : 'Edit'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className='py-2 text-md mb-3 font-bold'>Todo Details</div>
          <div className='mt-20 flex flex-col justify-center items-center'>
            <img src={waitingSvg} alt='' className='w-[50%] mb-8' />
            <p className='text-sm text-gray-400'>Select a Todo Item</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Details;
