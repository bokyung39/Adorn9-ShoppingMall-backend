function loginRequired(req,res,next){
  if(!req.user) {
    console.log('로그인 해')
    res.redirect('/')
    return;
  }

  if(req.user.passwordReset){
    res.redirect('/change-password')
    return;
  }
  next();
}

module.exports = loginRequired;