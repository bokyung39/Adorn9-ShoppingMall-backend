const { Router } = require('express');
const passport = require('passport'); 
const {setUserToken} = require('../utils/jwt'); 
const router = Router();
const asyncHandler = require('../utils/async-handler');
/*
로그인 성공 데이터
{
  "email": "aaaaa@example.com",
  "password": "1234!@asd56"
}
hashpassword: $2b$08$AN10tp5cY4O6kdE4i8a9DukYylAs0O/hoC5.VwPVy2WMIOk4mogtK
*/


router.post('/login', passport.authenticate('local', { session: false }), asyncHandler((req, res) => {
  //throw{status:400, message:"throw"};
  setUserToken(res, req.user);
  res.status(200).json({
    message: '로그인 성공'
  });
}));


// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', { session: false }, (err, user, info) => {
//     if (err) {
//       console.error('로그인 중 오류 발생:', err);
//       return next(err); // 에러를 에러 핸들러로 넘김
//     }
//     setUserToken(res, req.user);
//     res.status(200).json({ message: '로그인 성공' });
//   })(req, res, next);
// });


router.get('/logout', (req, res) => {
  try {
    // 쿠키를 삭제하기 위해 clearCookie() 메서드 사용
    res.clearCookie('token'); // 'token'은 삭제하려는 쿠키의 이름
    return res.status(202).json({ message: '로그아웃 성공' });
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
  }
});

module.exports = router;