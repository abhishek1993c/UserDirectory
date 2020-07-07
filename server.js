const express = require('express');
const app = express();
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
app.use('/api/auth', require('./routes/api/auth'));

app.listen(PORT, () => console.log(`Serveris running on port ${PORT}`));
