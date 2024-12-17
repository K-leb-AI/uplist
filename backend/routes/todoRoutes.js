const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  postTodo,
  updateTodo,
  deleteTodo,
  deleteMultipleTodos,
  getTodosDueTodaySummary,
} = require('../controllers/todoController.js');
const protectRoute = require('../middleware/authorization');

router
  .route('/')
  .post(protectRoute, postTodo)
  .delete(protectRoute, deleteMultipleTodos);
router
  .route('/:todoId')
  .put(protectRoute, updateTodo)
  .delete(protectRoute, deleteTodo);

module.exports = router;
