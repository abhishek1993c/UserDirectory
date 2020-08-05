const express = require('express');
const app = express();
const socketIo = require('socket.io');
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');

//Connect DB
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//test api
app.get('/', (req, res) => res.send('API is running successfully'));

//Route definitions
app.use('/api/users', require('./routes/api/users'));

const server = app.listen(PORT, () =>
  console.log(`Serveris running on port ${PORT}`)
);

io = socketIo(server);
app.use('/api', require('./routes/api/power')(io));
