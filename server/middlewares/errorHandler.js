function errorHandler(error, req, res, next) {
    res.status(400).json({ status: 400, msg: error.message });;
  }
  
  module.exports = errorHandler;
  