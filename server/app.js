const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

const loginRouter = require('./routes/loginRouter');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter')
const orderRouter = require('./routes/orderRouter');
const errorHandler = require('./middlewares');
const getUserFromJWT = require('./middlewares/get-user-from-jwt');
const { swaggerUi, specs } = require("./swagger")
//const session = require('express-session');
const passport = require('passport'); 
const cookieParser = require('cookie-parser');

require('dotenv').config();

const MongoURL = process.env.MONGO_URL;
mongoose.connect(MongoURL);
mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected');
})

require('./passport')();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session 방식에서 jwt방식으로 수정중이라 session 부분 일단 주석처리 
// app.use(session({
//     secret: 'team9', // 세션을 암호화하기 위한 키
//     resave: false,
//     saveUninitialized: false
//   }));

app.use(passport.initialize());
//app.use(passport.session());

app.use(getUserFromJWT);
app.use(cookieParser());
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter)
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/users', loginRouter); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.use('/', (req,res) => {
    res.send('ok');
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server start with port:${PORT}`);
}); 
