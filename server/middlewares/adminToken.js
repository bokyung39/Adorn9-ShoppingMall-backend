const jwt = require('jsonwebtoken');
const secret = 'elice';

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]??"null";
    if (!token) return res.status(401).send('Unauthorized');
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).send(err);
        req.user = user;
        if(!req.user.admin){throw new Error('권한이 없습니다.')}
        next();
    });
}

module.exports = authenticateToken;
