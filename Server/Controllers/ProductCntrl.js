const Product = require('../Model/productmodel');
const asynchandler = require('express-async-handler');
const slugify = require("slugify");


const createProduct = asynchandler(async(req,res) =>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch(error){
    res.send("Error while adding product");
}

});
//updateproduct

const updateProduct = asynchandler(async(req,res) => {
    const {id} = req.params;
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateProducts = await Product.findByIdAndUpdate(
            id,
              {
                title: req?.body?.title,
                slug: req?.body?.slug,
                description: req?.body?.description,
                price: req?.body?.price,
                brand: req?.body?.brand,
                category: req?.body?.category,
                sold:req?.body?.sold,
                quantity:req?.body?.quantity,
                image:req?.body?.quantity,
                color:req?.body?.color,

              },
              {
                new: true,
              }
              );
              res.json(updateProducts)



    }catch(err){
        res.send("Error while updateing Product");
    }
})

//Get all product
const getallProduct= asynchandler(async (req,res) => {
    try {
        //Filtering
        const queryObj = { ...req.query};
        const excludeFields = ["page","sort","limit","fields"];
        excludeFields.forEach((el)=> delete queryObj[el]);
        console.log(queryObj);
        let queryStr= JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        console.log(JSON.parse(queryStr)) 
        let query = Product.find(JSON.parse(queryStr));
     // Sorting
    
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(" ");
        query = query.sort(sortBy);
    } else{
        query = query.sort('-createdAt');
    }

    // limiting the fields

    if(req.query.fields){
        const sortBy = req.query.sort.split(',').join(" ");
        query = query.select(fields);
    } else{
        query = query.select('-__v')
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page -1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page){
        const productCount = await Product.countDocuments();
        if(skip>= productCount) throw new Error("This page does no texist");
    }
    console.log(page,limit,skip);

    


    const product = await query;
    res.json(product);
}catch (error){
    res.send("Error will retrevig product data ")

}
})

//Get a single product

const getsingleProduct = asynchandler(async(req,res) => {
    const {id} = req.params;
    
    try{
        const SingleProduct = await Product.findById(id);
        res.json({SingleProduct});
        


    }catch(e){
        res.send("Error will fetching product data ")
    }
})

// Delete product
const DeletesinglProduct = asynchandler(async(req,res) => {
    const {id} = req.params;
    try{
        const DeleteProduct = await Product.findByIdAndDelete(id);
        res.json({
            DeleteProduct
        });
    
    }catch(e){
        res.send("Error will fetching product data ")
    }
})





module.exports={ createProduct, getallProduct, getsingleProduct, DeletesinglProduct, updateProduct};