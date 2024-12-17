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
import { postCollection, getCollections } from '../axios'; // Ensure this function is correctly implemented
import toast from 'react-hot-toast';

const CollectionModal = ({ onAddCollection }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [collectionData, setCollectionData] = useState({ name: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCollectionData({ name: e.target.value });
  };

  const handleCollectionAdd = async () => {
    if (!collectionData.name.trim()) {
      toast.error('Collection name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await postCollection({ collectionData });
      if (response.status === 201) {
        toast.success(response.data.message);
        setCollectionData({ name: '' });
        onOpenChange(false);
        const result = await getCollections();
        onAddCollection(result.data.collections);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error(
        error.response.data.message ||
          'An error occurred while adding the collection'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className='bg-gray-700 sm:bg-gray-200 hover:bg-gray-300 text-white sm:text-black text-sm rounded-md w-full aspect-square min-w-0 sm:min-w-8 sm:w-8 sm:h-8 p-0'
      >
        +
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add a Collection
              </ModalHeader>
              <ModalBody>
                <label
                  htmlFor='collectionName'
                  className='text-xs block font-medium'
                >
                  Collection Name
                </label>
                <input
                  id='collectionName'
                  name='collectionName'
                  onChange={handleChange}
                  value={collectionData.name}
                  type='text'
                  className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-xs placeholder:text-xs'
                  placeholder='Enter collection name'
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  className='text-xs'
                  onPress={() => {
                    onClose();
                    setCollectionData({ name: '' }); // Reset input on close
                  }}
                >
                  Close
                </Button>
                <Button
                  className='bg-gray-200 hover:bg-gray-300 text-black px-6 text-xs py-3'
                  onPress={handleCollectionAdd}
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

export default CollectionModal;
