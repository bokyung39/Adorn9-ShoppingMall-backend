const jwt = require('jsonwebtoken');
const secret = 'elice';

function authenticateToken(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');
    jwt.verify(token, secret, (err, user) => {
        //console.log(err);
        if (err) return res.status(403).send('Forbidden');
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
