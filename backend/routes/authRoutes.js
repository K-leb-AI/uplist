const express = require('express');
const router = express.Router();
const {
  signupController,
  loginController,
  logoutController,
  authCheckController,
} = require('../controllers/authController');
const protectRoute = require('../middleware/authorization');

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/check', protectRoute, authCheckController);

module.exports = router;
