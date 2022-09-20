const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');

// application/x-www-form-urlencoded 이렇게 된 data를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 'json type'으로 된 것을 분석해서 가져올 수 있게
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => res.send('welcome!!'));

app.post('/register', (req, res) => {
  // 회원가입시 필요한 정보들을 client에서 get하면
  // DB에 넣어준다

  const user = new User(req.body); // bodyParser를 이용해 requset body로 client에서 받아온 정보를 받아준다.
  // save -> mongodb method
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
