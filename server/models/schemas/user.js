const {Schema} = require ('mongoose');

const UserSchema = new Schema({
  
  email: {
    type:String,
    required:true,
    unique:true
   }, //유저 이메일
  password: {
    type:String,
    required:true
   }, //유저 비밀번호
  user_name: {
    type:String,
    required:true
   }, //유저 이름
  phone_number: {
    type:String,
    required:true
   }, // 유저 전화번호
  address: {
    type:String,
    required:true
   }, // 유저 주소
  birth: {
    type:Number,
   }, //유저 생일
   created_at:{
    type:Date,
    default:new Date().toDateString()
   },//가입일자
   admin:{
    type:Boolean,
    default:false
   },//관리자 여부. 기본값은 그냥 회원
  order_list: [{ type: Schema.Types.ObjectId, ref: "Order" }], //유저 주문내역
})

module.exports = {UserSchema};
