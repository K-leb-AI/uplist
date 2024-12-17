const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
      },
    ],
  },
  { timestamps: true }
);

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
