const express = require('express');
const { createProduct, getallProduct, getsingleProduct, DeletesinglProduct, updateProduct } = require( '../Controllers/ProductCntrl');
const router = express.Router();
const { isAdmin, AuthMiddleware }= require('../Middlerware/authmiddleware');




router.post('/addproduct', AuthMiddleware, isAdmin,createProduct);
router.get('/getallproduct', getallProduct);
router.get('/singleproduct/:id',getsingleProduct);
router.delete('/Deleteproduct/:id' ,AuthMiddleware,isAdmin, DeletesinglProduct);
router.put('/update-product/:id', AuthMiddleware,isAdmin ,updateProduct);




module.exports=router