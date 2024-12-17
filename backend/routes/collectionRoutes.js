const express = require('express');
const router = express.Router();
const protectRoute = require('../middleware/authorization.js');

const {
  createCollection,
  getCollections,
  getOneCollection,
  updateCollection,
  deleteCollection,
  getTodosInCollection,
} = require('../controllers/collectionController.js');

router
  .route('/')
  .post(protectRoute, createCollection)
  .get(protectRoute, getCollections);

router
  .route('/:collectionId')
  .get(protectRoute, getOneCollection)
  .put(protectRoute, updateCollection)
  .delete(protectRoute, deleteCollection);

router.route('/:collectionId/todos').get(protectRoute, getTodosInCollection);

module.exports = router;
