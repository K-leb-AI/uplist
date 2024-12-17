const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const path = require('path');

const connectDB = require('./lib/db');
const authRoutes = require('./routes/authRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const todoRoutes = require('./routes/todoRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();
const port = process.env.PORT;
// const dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/collections/:collectionId/todos', todoRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/collections', collectionRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is listening on server ${port}`);
  connectDB();
});
