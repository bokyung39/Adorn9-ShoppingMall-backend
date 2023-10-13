const jwt = require('jsonwebtoken');
//const secret = process.env.JWT_SECRET;
const secret = 'elice';
exports.secret = secret;

exports.setUserToken = (res, user) => {

  const tokenPayload = {
    userId: user.id,
    email:user.email,
    userName: user.user_name,
    isAdmin: user.admin,
    passReset: user.password_reset
    // 사용자의 관리자 여부 정보를 토큰에 추가
};

  const token = jwt.sign(tokenPayload, secret);
  console.log(token);
  return {
    message: '로그인 성공',
    token: token,
    email:user.email
  };
};