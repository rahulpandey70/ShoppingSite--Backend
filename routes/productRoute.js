const { verifyTokenAndAdmin } = require('../middleware/verifyToken')
const Product = require('../models/Product')
const router = require('express').Router()

// Create
router.post('/', verifyTokenAndAdmin, async(req, res) => {
    const newProduct = new Product(req.body)

    try {
        const saveProduct = await newProduct.save()
        res.status(200).json(saveProduct)

    } catch (error) {
        res.status(500).json(error)
    }
})


// Update 
router.put('/:id', verifyTokenAndAdmin, async(req,res)=> {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedProduct)
    }catch (error) {
        res.status(500).json(error)
    }
})

//Delete
router.delete('/:id', verifyTokenAndAdmin, async(req,res)=> {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get Product
router.get('/find/:id', async(req,res)=> {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get All Product
router.get('/', async(req,res)=> {
    const query = req.query.new
    const queryCategory = req.query.category

    try {
        let products;

        if(query){
            products = await Product.find().sort({_id: -1}).limit(5)   
        } else if(queryCategory) {
            products = await Product.find({
                categories: {
                    $in: [queryCategory],
                },
            })
        }else{
            products = await Product.find()
        }

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router