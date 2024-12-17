const express = require('express');
const router = express();
const getSummary = require('../controllers/summaryController.js');
const protectRoute = require('../middleware/authorization.js');

router.get('/', protectRoute, getSummary);

module.exports = router;
