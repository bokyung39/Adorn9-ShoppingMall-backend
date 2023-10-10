const jwt = require('jsonwebtoken');
const secret = 'elice';

function authenticateToken(req, res, next) {
    //console.log("hi");
    const token = req.header('Authorization').split(' ')[1];;
    // const decoded = jwt.decode(token);
    // console.log(decoded);
    if (!token) return res.status(401).send('Unauthorized');
    //console.log(token);
    //console.log(req.headers);
    jwt.verify(token, secret, (err, user) => {
        //console.log(err);
        if (err) return res.status(403).send('Forbidden');
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;