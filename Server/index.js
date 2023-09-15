const express = require('express');
const app= express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const dbConnect = require("../Server/Configs/dbConnect");
const cookiepraser = require("cookie-parser");
const cors = require('cors');

const authRouter= require("../Server/Routes/authRoutes");
const productRouter = require("../Server/Routes/ProductRouts");
const bodyParser = require('body-parser');
const morgan = require("morgan");

dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookiepraser());
app.use(cors())

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});