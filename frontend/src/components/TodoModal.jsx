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
import { postTodo } from '../axios'; // Ensure this function is correctly implemented
import toast from 'react-hot-toast';
import { getTodosInCollection } from '../axios';

const TodoModal = ({ collectionId, setDataArray }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
    due: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (e) => {
    e.preventDefault();
    setTodoData({ ...todoData, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    e.preventDefault();
    setTodoData({ ...todoData, description: e.target.value });
  };

  const handleDateChange = (e) => {
    setTodoData({ ...todoData, due: e.target.value });
    e.preventDefault();
  };

  const handleTodoAdd = async () => {
    if (
      todoData.title === '' ||
      todoData.description === '' ||
      todoData.due === ''
    ) {
      return toast.error('All fields must be filled');
    }

    setIsLoading(true);
    try {
      const response = await postTodo({ todoData, collectionId });
      if (collectionId == null || collectionId == '') {
        return toast.error('You must create a Todo with a collection');
      }
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
      console.error('Error creating todo:', error.response.data.message);
      toast.error(
        error.message || 'An error occurred while adding the todo item'
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
                <div className='flex flex-col gap-1 mb-2'>
                  <label
                    htmlFor='todoName'
                    className='text-xs block mb-1 font-medium'
                  >
                    Todo title
                  </label>
                  <input
                    name='todoName'
                    onChange={(e) => handleTitleChange(e)}
                    value={todoData.title}
                    type='text'
                    className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-xs placeholder:text-xs'
                    placeholder='Enter todo title'
                  />
                </div>
                <div className='flex flex-col gap-1 mb-2'>
                  <label
                    htmlFor='todoDescription'
                    className='text-xs block mb-1 font-medium'
                  >
                    Description
                  </label>
                  <input
                    name='todoDescription'
                    onChange={(e) => handleDescriptionChange(e)}
                    value={todoData.description}
                    type='textarea'
                    className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-xs placeholder:text-xs'
                    placeholder='Describe your task'
                  />
                </div>
                <div className='flex flex-col gap-1 mb-2'>
                  <label
                    htmlFor='todoDue'
                    className='text-xs block mb-1 font-medium'
                  >
                    Due date
                  </label>
                  <input
                    name='todoDue'
                    onChange={(e) => handleDateChange(e)}
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
                    setTodoData({
                      title: '',
                      description: '',
                      due: '',
                    }); // Reset input on close
                  }}
                >
                  Close
                </Button>
                <Button
                  className='bg-gray-200 hover:bg-gray-300 text-black px-6 py-3'
                  onPress={handleTodoAdd}
                  isDisabled={isLoading} // Disable button during loading
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
