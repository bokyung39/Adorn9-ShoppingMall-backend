function loginRequired(req,res,next){
  if(!req.user) {
    res.redirect('/')
    next(`로그인하셔야 합니다.`)
    return;
  }

  if(req.user.passwordReset){
    res.redirect('/change-password')
    return;
  }
  next();
}

module.exports = loginRequired;