const Collection = require('../models/Collection.js');
const Todo = require('../models/Todo.js');

const createCollection = async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;
  try {
    if (!name) {
      return res.status(400).json({ message: 'Collection name is required' });
    }

    const newCollection = new Collection({
      userId,
      name,
    });

    await newCollection.save();
    return res
      .status(201)
      .json({ message: 'Collection created', collection: newCollection });
  } catch (error) {
    console.error('Error creating collection:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getCollections = async (req, res) => {
  const userId = req.user._id;
  try {
    const collections = await Collection.find({ userId });
    return res.status(200).json({ collections });
  } catch (error) {
    console.error('Error fetching collections:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getOneCollection = async (req, res) => {
  const { collectionId } = req.params;
  try {
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    return res.status(200).json({ collection });
  } catch (error) {
    console.error('Error fetching collection:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCollection = async (req, res) => {
  const { collectionId } = req.params;
  const { name } = req.body;

  try {
    const collection = await Collection.findByIdAndUpdate(
      collectionId,
      { name },
      { new: true, runValidators: true }
    );

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    return res.status(200).json({ message: 'Collection updated', collection });
  } catch (error) {
    console.error('Error updating collection:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await Collection.findByIdAndDelete(collectionId);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    await Todo.deleteMany({ collectionId });

    return res.status(200).json({ message: 'Collection deleted' });
  } catch (error) {
    console.error('Error deleting collection:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getTodosInCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const todos = await Todo.find({ collectionId });
    return res.status(200).json({ todos });
  } catch (error) {
    console.error('Error fetching todos in collection:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCollection,
  getCollections,
  getOneCollection,
  updateCollection,
  deleteCollection,
  getTodosInCollection,
};
