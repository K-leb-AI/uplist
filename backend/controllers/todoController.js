const Todo = require('../models/Todo');
const Collection = require('../models/Collection');
const mongoose = require('mongoose');

const postTodo = async (req, res) => {
  const { collectionId } = req.params;
  const { title, description, due } = req.body;
  const userId = req.user._id;

  try {
    if (!title || !description || !due || !collectionId) {
      return res.status(400).json({
        message:
          'All fields (title, description, due, collectionId) are required',
      });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection || collection.userId.toString() !== userId.toString()) {
      return res
        .status(404)
        .json({ message: 'collection not found or unauthorized' });
    }

    const newTodo = new Todo({
      collectionId,
      title,
      description,
      due,
      isCompleted: false,
    });

    await newTodo.save();

    collection.todos.push(newTodo._id);
    await collection.save();

    res
      .status(201)
      .json({ message: 'Todo created successfully', todo: newTodo });
  } catch (error) {
    console.error('Error in createTodo:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTodo = async (req, res) => {
  const { todoId } = req.params;
  const { collectionId } = req.params;
  const { title, description, due, isCompleted } = req.body;

  try {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (collectionId) {
      const collection = await Collection.findById(collectionId);
      if (!collection) {
        return res.status(404).json({ message: 'collection not found' });
      }
      todo.collectionId = collectionId;
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.due = due || todo.due;
    todo.isCompleted = isCompleted || todo.isCompleted;

    await todo.save();
    res.status(200).json({ message: 'Todo updated successfully', todo });
  } catch (error) {
    console.error('Error in updateTodo:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteTodo = async (req, res) => {
  const { todoId } = req.params;

  try {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const collection = await Collection.findById(todo.collectionId);
    if (collection) {
      collection.todos = collection.todos.filter(
        (id) => id.toString() !== todoId
      );
      await collection.save();
    }

    await todo.deleteOne();
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTodo:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteMultipleTodos = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: 'Invalid request. Provide an array of IDs.' });
    }

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const todosToDelete = await Todo.find({ _id: { $in: objectIds } });

    if (todosToDelete.length === 0) {
      return res.status(404).json({ message: 'No items found to delete.' });
    }

    for (const todo of todosToDelete) {
      await Collection.findByIdAndUpdate(todo.collectionId, {
        $pull: { todos: todo._id },
      });
    }

    const result = await Todo.deleteMany({ _id: { $in: objectIds } });

    return res.status(200).json({
      message: `${result.deletedCount} item(s) deleted successfully.`,
    });
  } catch (error) {
    console.error('Error in deleteMultipleTodos controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  postTodo,
  updateTodo,
  deleteTodo,
  deleteMultipleTodos,
};
