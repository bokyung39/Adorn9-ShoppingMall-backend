const {Router } = require ('express');
const {User} =require ('../models');
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password')
const formCheck = require('../services/userService')
const check = require('../services/userService')
const router = Router();


//회원가입
router.post('/join', asyncHandler(async (req,res,next)=>{
    const {password,user_name,address,phone_number,email}=req.body;
     const hashedPassword = hashPassword(password)//비밀번호 해쉬화
    formCheck.check(password,email,phone_number)
    try{
   const user = await User.create({
     email,
      password: hashedPassword,
      user_name,
      phone_number,
      address
      })
    res.status(201).send({status:201,msg:`${user_name}님의 가입을 환영합니다.`,user})
    res.redirect('/')
    }
    catch(err){next(err)}
}))

//개인 정보 조회
router.get('/userinfo' ,asyncHandler(async(req,res,next)=>{
  try{
  const viewkey = req.body.email
  const Profile = await User.findOne({email:viewkey})
  res.status(200).send({
    status:200,
    msg:`${Profile.user_name}님의 개인 정보입니다.`,
    email:Profile.email,
    name:Profile.user_name,
    address:Profile.address,
    phone_number:Profile.phone_number,
    created_at:Profile.created_at,
    order_list:Profile.order_list
  })
  }
  catch(err){
    next(err)
  }
}))

//회원 정보 수정
router.put('/modify', asyncHandler(async(req,res,next)=>{
  
  const {password,user_name,address,phone_number,email} = req.body
try{
  formCheck.check(password,email,phone_number)
  const updateUser =await User.updateOne({email},{
    password:hashPassword(req.body.password),
    name:req.body.user_name,
    address:req.body.address,
    phone_number:req.body.phone_number,
    })
  res.status(200).send({status:200, msg:'개인정보가 수정됐습니다'})
  }
  catch(err){next(err)}
}))

//회원 탈퇴
router.delete('/withdraw',asyncHandler(async(req,res,next)=>{
  try{
  const {email,user_name} = req.body
  await User.deleteOne({email})
  res.status(200).send({status:200, msg:`${user_name}님의 탈퇴가 완료됐습니다.`})
  }
  catch(err){next(err)}
}))






module.exports = router;