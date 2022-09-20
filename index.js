const express = require('express');
const app = express();
const port = 8000;
const { User } = require('./models/User');

const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://wogkdkrm:wogkdkrm@login.yl8h8vj.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('welcome');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
