const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter')
const orderRouter = require('./routes/orderRouter');
const categoryRouter = require('./routes/categoryRouter');
const errorHandler = require('./middlewares');
// const { swaggerUi, specs } = require("./swagger/swagger")
const passport = require('passport'); 
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json')
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

app.use(passport.initialize());
app.use(cookieParser());
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/categories', categoryRouter);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));
app.use('/', (req,res) => {
    res.send('ok');
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server start with port:${PORT}`);
});