const {Router } = require ('express');
const {User} =require ('../models');
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password')
const formCheck = require('../services/userService')
const check = require('../services/userService')
const router = Router();


//회원가입
router.post('/joining', asyncHandler(async (req,res,next)=>{
    const {password,user_name,phone_number,email}=req.body;
    const hashedPassword = hashPassword(password)//비밀번호 해쉬화
    const dupli_check = await User.findOne({email})
    if(dupli_check) {throw new Error("이미 등록된 계정입니다.")}
    formCheck.check(password,email,phone_number)
    
   const user = await User.create({
     email,
      password: hashedPassword,
      user_name,
      phone_number
      })
    res.status(201).json({status:201,msg:`${user_name}님의 가입을 환영합니다.`,user})
    res.redirect('/')
    }
))

//개인 정보 조회
router.get('/profile' ,asyncHandler(async(req,res,next)=>{
  
  const viewkey = req.body.email
  const Profile = await User.findOne({email:viewkey})
  if(!Profile) {throw new Error('존재하지 않는 계정입니다.')}
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
  
  const {password,user_name,phone_number,email} = req.body

  formCheck.check(password,email,phone_number)
  const updateUser =await User.updateOne({email},{
    password:hashPassword(req.body.password),
    name:req.body.user_name,
    phone_number:req.body.phone_number,
    })
  res.status(200).json({status:200, msg:'개인정보가 수정됐습니다'})
 
}))

//회원 탈퇴
router.delete('/withdraw',asyncHandler(async(req,res,next)=>{
 
  const {email,user_name} = req.body
  await User.deleteOne({email})
  res.status(200).json({status:200, msg:`${user_name}님의 탈퇴가 완료됐습니다.`})
 
}))






module.exports = router;