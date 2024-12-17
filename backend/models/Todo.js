const mongoose = require('mongoose');

const todoModel = mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    due: {
      type: Date,
      required: true,
    },

    isCompleted: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoModel);

module.exports = Todo;
