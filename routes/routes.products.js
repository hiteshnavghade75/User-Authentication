const express = require('express');
const Product = require("../model/product.model")
const authMiddleware = require('../middleware/auth')
const productRouter = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


productRouter.get('/get/products', async (req, res) => {
    try {
      const query = {};
  
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = (page - 1) * limit;
  
      if (req.query.category) {
        query.category = req.query.category;
      }
  
      if (req.query.author) {
        query.author = req.query.author;
      }
  
      const posts = await Product.find(query).skip(skip).limit(limit);
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ 
        message: 'Failed to fetch posts', 
        error: err.message 
    });
    }
});

/**
 * @swagger
 * /product/get/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get products
 *     description: Get a list of products with optional filtering by category and pagination.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category
 *         in: query
 *         type: string
 *         description: Filter products by category.
 *       - name: page
 *         in: query
 *         type: integer
 *         description: Page number for pagination.
 *       - name: limit
 *         in: query
 *         type: integer
 *         description: Number of products per page.
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:         
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             error:
 *               type: string
 */

productRouter.get('/get/products/:id', async (req, res) => {
    try {
        const data = await Product.findById(req.params.id)
        res.status(200).json(data)
    } catch (err) {
        res.json({ message: err.message })
    }
});

/**
 * @swagger
 * /product/get/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Fetch a product from the database by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the product to fetch.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response with the product data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the product.
 *                 name:
 *                   type: string
 *                   description: The name of the product.
 *                 price:
 *                   type: number
 *                   description: The price of the product.
 *                 description:
 *                   type: string
 *                   description: The description of the product.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the product was not found.
 */

productRouter.post("/add/product", authMiddleware, (req, res) => {
 
    const product = new Product({...req.body, author: req.adminId})

    product.save().then(newProduct => {
        res.status(201).json({
            message: "Post saved successfully",
            data: newProduct
        })
    })
        .catch(err => {
            res.status(500).json({
                message: "failed",
                error: err
            })
        })
});

productRouter.put('/update/:id', authMiddleware, async (req, res) => {
    try {
        updateData = req.body
        const data = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
        res.json({
            status: "success",
            result: data
        })
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
});

productRouter.delete('/delete/:id', async (req, resp) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        resp.status(200).json({ message: 'data deleted succefully' })
    } catch (err) {
        resp.json({ message: err.message })
    }
})

module.exports = productRouter;

