const {Router } = require ('express');
const asyncHandler = require('../utils/async-handler');
const {userService} = require('../services/userService')
const router = Router();
const passport = require('passport'); 
const loginRequired = require('../middlewares/login-required');
const { User } = require('../models');

//회원가입


router.post('/joining',asyncHandler(async(req,res,next)=>{

  const {email,user_name,password,phone_number} =req.body;
  const userinfo = {email,user_name,password,phone_number}

  await userService.formCheck(userinfo);

  const newUser = await userService.userJoin(userinfo)

  res.status(201).json({
    status:201,
    msg:`${user_name}님의 가입을 환영합니다.`,
    newUser
  })
}))


//개인정보 조회
router.get('/profile', asyncHandler(async(req,res,next)=>{

  const role = req.body.admin;
  const userinfo = req.body.email;

  const Profile = await userService.myProfile(userinfo)
  res.status(200).json({
    status:200,
    msg:`${Profile.user_name}님의 개인 정보입니다.`,
    email:Profile.email,
    name:Profile.user_name,
    phone_number:Profile.phone_number,
    order_list:Profile.order_list
      
  })
}))

//회원 정보 수정

  router.put('/modify', asyncHandler(async(req,res,next)=>{
    const {email,password,user_name,phone_number} =req.body;
    const userinfo = {email,password,user_name,phone_number}

    await userService.formCheck(userinfo);
    const updatedUser = await userService.userUpdate(userinfo)
    
    res.status(200).json({status:200, msg:'개인정보가 수정됐습니다.'})
    
  }))

//회원 탈퇴
router.delete('/withdraw', asyncHandler(async(req,res,next)=>{

  const {email, user_name}= req.body;
  const goodbye_user = await User.findOne({email})
  await userService.resignUser(email);
  res.status(200).json({status:200, msg:`${goodbye_user.user_name}님의 탈퇴가 완료됐습니다.`})
}))

//비밀번호 찾기
router.post('/reset-password', asyncHandler(async(req,res,next)=>{
  const {email} = req.body;
  const user = await findOne({email})
  if(!user) {throw new Error('등록된 계정이 아닙니다.')}
  const goodbye = await userService.passwordReset(email)
  res.status(200).send({status:200, msg:'변경된 비밀번호를 이메일로 발송했습니다.'})
}))

router.post('/changing-password',asyncHandler(async(req,res,next)=>{
  res.render('')
}))




router.post('/login', passport.authenticate('local'), asyncHandler(async (req, res) => {
  // 로그인 성공 시 처리
  res.status(200).json({
    message: '로그인 성공'
  });
}));

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

//주문 목록 조회

// router.get('/order-list/?user_name',asyncHandler(async(req,res,next)=>{
//   const buyer_name = req.query.user_name;

// })



module.exports = router;