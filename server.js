const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

//test api
app.get('/', (req, res) => res.send('API is running successfully'));

app.listen(PORT, () => console.log(`Serveris running on port ${PORT}`));
