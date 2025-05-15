const express = require('express');
const cors = require('cors');
const app = express();
const startServer = require('./dbConnection/index.js');
require("dotenv").config();


const PORT = process.env.PORT 
app.use(express.json());
app.use(cors("*"));

app.get('/', (req, res) => {
  res.send(`Server is running on Port :${PORT}`);
});


app.listen(PORT, () => {
  console.log(`Server is running on Port :${PORT}`);
});

startServer()