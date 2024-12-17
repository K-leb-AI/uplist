import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { postTodo } from '../axios';
import toast from 'react-hot-toast';

const TodoModal = ({ collectionId, setDataArray }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
    due: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTodoAdd = async () => {
    if (!collectionId) {
      return toast.error('Please select a collection first.');
    }

    if (!todoData.title || !todoData.description || !todoData.due) {
      return toast.error('All fields must be filled.');
    }

    setIsLoading(true);
    try {
      const response = await postTodo({ todoData, collectionId });
      if (response.status === 201) {
        setTodoData({
          title: '',
          description: '',
          due: '',
        });
        setDataArray((prevArray) => [...prevArray, response.data.todo]);
        toast.success('Todo has been created');
        onOpenChange(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while adding the todo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className='bg-gray-700 sm:bg-gray-200 hover:bg-gray-300 text-white sm:text-black rounded-md text-xs py-2 px-4 h-auto'
      >
        Post a Todo
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add an item To-do
              </ModalHeader>
              <ModalBody>
                {/* Title Input */}
                <div className='flex flex-col gap-1 mb-2'>
                  <label
                    htmlFor='title'
                    className='text-xs block mb-1 font-medium'
                  >
                    Todo title
                  </label>
                  <input
                    name='title'
                    onChange={handleInputChange}
                    value={todoData.title}
                    type='text'
                    className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-xs placeholder:text-xs'
                    placeholder='Enter todo title'
                  />
                </div>

                {/* Description Input */}
                <div className='flex flex-col gap-1 mb-2'>
                  <label
                    htmlFor='description'
                    className='text-xs block mb-1 font-medium'
                  >
                    Description
                  </label>
                  <textarea
                    name='description'
                    onChange={handleInputChange}
                    value={todoData.description}
                    className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-xs placeholder:text-xs'
                    placeholder='Describe your task'
                  />
                </div>

                {/* Due Date Input */}
                <div className='flex flex-col gap-1 mb-2'>
                  <label
                    htmlFor='due'
                    className='text-xs block mb-1 font-medium'
                  >
                    Due date
                  </label>
                  <input
                    name='due'
                    onChange={handleInputChange}
                    value={todoData.due}
                    type='date'
                    className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-xs'
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={() => {
                    onClose();
                    setTodoData({ title: '', description: '', due: '' });
                  }}
                >
                  Close
                </Button>
                <Button
                  className='bg-gray-200 hover:bg-gray-300 text-black px-6 py-3'
                  onPress={handleTodoAdd}
                  isDisabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TodoModal;
