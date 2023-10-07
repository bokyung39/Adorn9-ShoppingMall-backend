const { Router } = require('express');
const passport = require('passport'); 
const asyncHandler = require('../utils/async-handler');
const router = Router();
/*
로그인 성공 데이터
{
  "email": "usera@example.com",
  "password": "1234"
}
hashpassword: $2b$08$AN10tp5cY4O6kdE4i8a9DukYylAs0O/hoC5.VwPVy2WMIOk4mogtK
*/
router.post('/login', passport.authenticate('local'), asyncHandler(async (req, res) => {
  // 로그인 성공 시 처리
  res.status(200).json({
    message: '로그인 성공'
  });
}));

// 로그아웃
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
    }
    res.status(202).json({
      message: '로그아웃 성공'
    });
  });
});

module.exports = router;