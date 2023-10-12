const {Router } = require ('express');
const asyncHandler = require('../utils/async-handler');
const {userService} = require('../services/userService')
const router = Router();
const { setUserToken } = require('../utils/jwt'); 
const passport = require('passport'); 
const loginRequired = require('../middlewares/login-required');
const authenticateToken = require('../middlewares/authenticateToken');
const authenticateTokenAdmin = require('../middlewares/authenticateTokenAdmin');
const { User } = require('../models');

//회원가입


router.post('/joining',asyncHandler(async(req,res,next)=>{
/**
    * #swagger.tags = ['User']
    * #swagger.summary = '회원 가입'
    */
  const {email,user_name,password,phone_number} =req.body;
  const userinfo = {email,user_name,password,phone_number}

  await userService.formCheck(userinfo);

  const newUser = await userService.userJoin(userinfo)
  setUserToken(res, newUser);
  res.status(201).json({
    status:201,
    msg:`${user_name}님의 가입을 환영합니다.`,
    newUser
  })
}))


//개인정보 조회. 쿼리값이 본인 이메일과 다르면 조회가 안되지만
// 관리자 계정이면 조회가 가능하다.
router.get('/profile',authenticateToken, asyncHandler(async(req,res,next)=>{
  /**
    * #swagger.tags = ['User']
    * #swagger.summary = '개인 정보 조회'
    */
  const admin = req.user.email
  const email = req.query.email 
  console.log(req.user)

  if(email == req.user.email||await userService.checkAdmin(admin))
   {
  const Profile = await userService.myProfile({email})
  res.status(200).json({
    status:200,
    msg:`${Profile.user_name}님의 개인 정보입니다.`,
    email:Profile.email,
    name:Profile.user_name,
    phone_number:Profile.phone_number,
    order_list:Profile.order_list
  })}
  else {throw new Error('조회 권한이 없습니다.')} 
  
}))

//회원 정보 수정

  router.put('/modify', authenticateToken, asyncHandler(async(req,res,next)=>{
    /**
    * #swagger.tags = ['User']
    * #swagger.summary = '회원 수정'
    */
    const email = req.query.email;
    const {password,user_name,phone_number} =req.body;
    const userinfo = {email,password,user_name,phone_number}
    const admin = req.user.email
    console.log(req.user)
  
    if(email == req.user.email||await userService.checkAdmin(admin))
     {
    await userService.formCheck(userinfo);
    const updatedUser = await userService.userUpdate(userinfo)
    
    res.status(200).json({status:200, msg:'개인정보가 수정됐습니다.'})
     }
     else{throw new Error(`수정 권한이 없습니다.`)}
  }))

//회원 탈퇴
router.delete('/withdraw', asyncHandler(async(req,res,next)=>{
/**
    * #swagger.tags = ['User']
    * #swagger.summary = '회원 탈퇴'
    */
  const {email, user_name}= req.body;
  const goodbye_user = await User.findOne({email})
  await userService.resignUser(email);
  res.status(200).json({status:200, msg:`${goodbye_user.user_name}님의 탈퇴가 완료됐습니다.`})
}))

//비밀번호 찾기
router.post('/reset-password', asyncHandler(async(req,res,next)=>{
  /**
    * #swagger.tags = ['User']
    * #swagger.summary = '비밀번호 찾기'
    */
  const {email} = req.body;
  const user = await User.findOne({email})
  if(!user) {throw new Error('등록된 계정이 아닙니다.')}
  const goodbye = await userService.passwordReset(email)
  res.status(200).send({status:200, msg:'변경된 비밀번호를 이메일로 발송했습니다.'})
}))

//비밀번호 변경
router.post('/changing-password',authenticateToken,asyncHandler(async(req,res,next)=>{
  /**
    * #swagger.tags = ['User']
    * #swagger.summary = '비밀번호 변경(비밀번호 찾기한 계정만)'
    */
  if(req.user.passwordReset==false){return res.redirect('/modify')}
  const email = req.user.email;
  const password = req.body;
  const userinfo = {email,password}
  await userService.passwordChange(userinfo)
  res.status(200).send({status:200, msg:`비밀번호가 성공적으로 변경됐습니다.`})
}))

//로그인
router.post('/login', passport.authenticate('local', { session: false }), asyncHandler(async(req, res, next) => {
  /**
    * #swagger.tags = ['User']
    * #swagger.summary = '로그인'
    */
  setUserToken(res, req.user); 
  console.log(req.user)
  
    res.status(200).json({
      message: `${req.user.user_name}님 환영합니다.`,

      
    });


}));

// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), asyncHandler(async (req, res) => {
  /**
    * #swagger.tags = ['User']
    * #swagger.summary = '구글 로그인'
    */
  // 사용자 토큰 설정
  setUserToken(res, req.user);
  // 로그인 후 리다이렉트할 경로 설정
  res.redirect('/');
}));

// 로그아웃
router.get('/logout', asyncHandler(async(req, res, next) => {
  /**
    * #swagger.tags = ['User']
    * #swagger.summary = '로그아웃'
    */
  try{
    // 쿠키를 삭제하기 위해 clearCookie() 메서드 사용
    res.clearCookie('token'); // 'token'은 삭제하려는 쿠키의 이름
    return res.status(202).json({ message: '로그아웃 성공' });
  }
  catch(err){
    console.error('로그아웃 중 오류 발생:', error);
    //return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
    error.status = 500;
    next(error);
  }
}));

module.exports = router;