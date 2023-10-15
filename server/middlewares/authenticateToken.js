const jwt = require('jsonwebtoken');
const secret = 'elice';

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]??"null";
    if (!token) return res.status(401).send('Unauthorized');
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).send(err);
        req.user = user;
        console.log(user);
        next();
    });
}

module.exports = authenticateToken;
