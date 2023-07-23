const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName : {type : String, required : true},
    productImage : {type : String, required : true},
    price : {type : String, required : true},
    description : {type : String, required : true},
    category : {type : String, required : true},
    author : {type : mongoose.Schema.Types.ObjectId, ref:'Admin', required : true}
},
{
    timestamps : true
})

module.exports = mongoose.model("Product", productSchema)