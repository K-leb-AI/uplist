const Todo = require('../models/Todo');

const getSummary = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todosSummary = await Todo.aggregate([
      {
        $match: {
          due: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $lookup: {
          from: 'collections', // Name of the MongoDB collection for collections
          localField: 'collectionId',
          foreignField: '_id',
          as: 'collection',
        },
      },
      {
        $group: {
          _id: '$collectionId',
          collectionName: { $first: '$collection.name' }, // Assuming collection has a "name" field
          totalTodos: { $sum: 1 }, // Count the todos per collection
        },
      },
    ]);

    const totalTodos = todosSummary.reduce(
      (accumulator, collection) => accumulator + collection.totalTodos,
      0
    );

    return res.status(200).json({
      message: 'Todos due today summary retrieved successfully',
      totalTodosDueToday: totalTodos,
      collections: todosSummary,
    });
  } catch (error) {
    console.error('Error in getTodosDueTodaySummary controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getSummary;
