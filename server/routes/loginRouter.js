const { Router } = require('express');
const passport = require('passport'); 
// const { setUserToken } = require('../utils/jwt'); 
const router = Router();
const asyncHandler = require('../utils/async-handler');

// /*
// 로그인 성공 데이터
// {
//   "email": "aaaaa@example.com",
//   "password": "1234!@asd56"
// }
// hashpassword: $2b$08$AN10tp5cY4O6kdE4i8a9DukYylAs0O/hoC5.VwPVy2WMIOk4mogtK
// */

// // 로그인
// router.post('/login', passport.authenticate('local', { session: false }), asyncHandler(async(req, res, next) => {
//   //throw{status:400, message:"throw"};
//   setUserToken(res, req.user);
//   try{
//     res.status(200).json({
//       message: '로그인 성공'
//     });
//   }catch(err){
//     error.status = 500;
//     next(error); 
//   }
// }));

// // 구글 로그인
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { session: false }), asyncHandler(async (req, res) => {
//   // 사용자 토큰 설정
//   // setUserToken(res, req.user);
//   // 로그인 후 리다이렉트할 경로 설정
//   res.redirect('/');
// }));

// // 로그아웃
// router.get('/logout', asyncHandler(async(req, res, next) => {
//   try {
//     // 쿠키를 삭제하기 위해 clearCookie() 메서드 사용
//     res.clearCookie('token'); // 'token'은 삭제하려는 쿠키의 이름
//     return res.status(202).json({ message: '로그아웃 성공' });
//   } catch (error) {
//     console.error('로그아웃 중 오류 발생:', error);
//     //return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
//     error.status = 500;
//     next(error);
//   }
// }));

// /*
// // 카카오 로그인 (미구현)
// router.get('/kakao', passport.authenticate('kakao'));
// router.get('/kakao/callback', passport.authenticate('kakao', {
//   failureRedirect: '/', // kakaoStrategy에서 실패한다면 실행
// }), asyncHandler(async (req, res) => {
//   // 로그인 후 리다이렉트할 경로 설정
//   res.redirect('/');
// }));

// router.get(
//   "/kakao/callback",
//   passport.authenticate("kakao", {
//     failureRedirect: "/",
//   }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );
// */

module.exports = router;