const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../lib/utils');

const signupController = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        token,
      });
    }
  } catch (error) {
    console.log('Error in signup Controller: ', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const logoutController = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (error) {
    console.log('Error in Logout Controller', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const authCheckController = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in authCheck controller', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  authCheckController,
};
