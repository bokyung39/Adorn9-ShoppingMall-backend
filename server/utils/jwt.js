const jwt = require('jsonwebtoken');
//const secret = process.env.JWT_SECRET;
const secret = 'elice';
exports.secret = secret;

exports.setUserToken = (res, user) => {
    // 유저 jwt 토큰생성
  const token = jwt.sign({ userId: user.id, userName: user.user_name }, secret);
  console.log(token);
    // 토큰을 쿠키로 전달
  res.cookie('token', token);
};