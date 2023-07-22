const express = require('express');
const Product = require("../model/product.model")
const authMiddleware = require('../middleware/auth')
const productRouter = express.Router();

// productRouter.get("/get/products", authMiddleware, (req,res) => {
//     const productId = Number(req.query.id)
//     let filter = {}

//     if(productId){
//         filter = {
//             id : productId
//         }
//     }

//     Product.find(filter).then(productData => {
//         res.status(200).json({
//             message : "data fetched successfully",
//             result : productData
//         })
//     })
//     .catch(err => {
//         res.status(500).json({
//             message : "Failed to fetch the data", 
//             error : err
//         })
//     })
// })

productRouter.get('/get/products', async (req, res) => {
    try {
        const data = await Product.find()
        res.status(200).json(data)
    } catch (err) {
        res.json({ message: err.message })
    }
})
productRouter.get('/get/products/:id', async (req, res) => {
    try {
        const data = await Product.findById(req.params.id)
        res.status(200).json(data)
    } catch (err) {
        res.json({ message: err.message })
    }
})

productRouter.post("/add/product",authMiddleware, (req, res) => {
    console.log(req.adminId)
    const productInfo = req.body
    const product = new Product({
        productName : productInfo.productName,
        productImage : productInfo.productImage,
        price : productInfo.price,
        description : productInfo.description,
        author : req.adminId
    })

    product.save().then(newProduct => {
        res.status(201).json({
            message : "Post saved successfully",
            data : newProduct
        })
    })
    .catch(err => {
        res.status(500).json({
            message : "failed",
            error : err
        })
    })
});


productRouter.put('/update/:id', authMiddleware, async (req, res) => {
   try{
    updateData = req.body
    const data = await Product.findByIdAndUpdate(req.params.id, updateData,{new : true})
    res.json({
        status : "success",
        result : data
    })
   }
   catch(err){
    res.json({
        message : err.message
    })
   }
  });

productRouter.delete('/delete/:id',async(req, resp)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        resp.status(200).json({message:'data deleted succefully'})
    } catch (err) {
        resp.json({message:err.message})
    }
})

module.exports = productRouter;

