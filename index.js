const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

// application/x-www-form-urlencoded 이렇게 된 data를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 'json type'으로 된 것을 분석해서 가져올 수 있게
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post('/api/users/register', (req, res) => {
  // 회원가입시 필요한 정보들을 client에서 get하면
  // DB에 넣어준다

  const user = new User(req.body); // bodyParser를 이용해 requset body로 client에서 받아온 정보를 받아준다.
  // save -> mongodb method
  // save 하기 전 암호화 진행
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  // 요청한 이메일을 DB에 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }

    // 요청한 이메일이 DB에 있다면 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });
      // 비밀번호가 맞다면 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토근을 저장 -> 쿠키, 로컬스토리지 등
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
