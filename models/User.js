const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// pre: mongoose method, 저장하기 전에 무언갈 한다
userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    // 비밀번호 암호화 시킨다
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      // user.password = plainpassword
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        // 암호화에 성공하면 hash로 교체
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 1234567 / 암호화된 pasword: "$2b$10$Wgx1ZayqbY/P4CK6dWVGYeYkyJPMsM.mE3oE53JEMwnTJonf7rcue"
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  let user = this;
  // jsonwebtoken을 이용해 token 생성
  let token = jwt.sign(user._id.toHexString(), 'secretToken');

  // user._id + 'secretToken = token'
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;

  // 토큰을 decode
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 유저 아이디를 이용해 유저 찾은 후 client에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
