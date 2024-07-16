const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 8000;

const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const authRoutes = require('./routes/auth');

app.use('/user', userRoutes)
app.use('/role', roleRoutes)
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the coderootz API');
});

//save to database
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
