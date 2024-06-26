import ProductModel from "../models/product.js";

export const getAll = async (req, res, next) => {
    try {
        const { sort, searchItem, page, categories, fromPrice, beforePrice } = req.query
        let products = []
        switch (sort) {
            case 'high-price':
                products = await ProductModel.find().sort({ price: 1 })
                break
            case 'low-price':
                products = await ProductModel.find().sort({ price: -1 })
                break
            case 'newest':
                products = await ProductModel.find().sort({ createAt: -1 })
                break
            case 'oldest':
                products = await ProductModel.find().sort({ createAt: 1 })
                break;
        }
        if (categories && categories.length) {
            products = products.filter(product => categories.includes(product.type.toLowerCase()));
        }
        if (searchItem.length > 3) {
            products = products.filter(product => product.title.toLowerCase().includes(searchItem.toLowerCase()))
        }
        if (+fromPrice < +beforePrice || (+fromPrice > +beforePrice && +beforePrice === 0)) {
            products = products.filter(product => +product.price >= +fromPrice)
        }
        if (+fromPrice < +beforePrice || +beforePrice > 0) {
            products = products.filter(product => +product.price <= +beforePrice)
        }

        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const create = async (req, res, next) => {
    try {
        const { title, description, price, kol, images, type } = req.body

        const product = await new ProductModel({
            title: title.toLowerCase(),
            description,
            price,
            kol,
            seller: req.userId,
            images,
            type
        })
        await product.save()
        res.json(product)

    } catch (error) {
        next(error)
    }
}
export const update = async (req, res, next) => {
    try {
        const productId = req.params.id
        const { title, description, price, kol, images, type } = req.body

        await ProductModel.updateOne({
            _id: productId
        }, {
            title: title.toLowerCase(),
            description,
            price,
            kol,
            images,
            type
        })
        res.json({
            success: true 
        })
    } catch (error) {
        next(error)
    }
}

export const getById = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if (!product) {
            return res.status(400).json({
                message: "Продукт не найден",
                error: "product-is-not-defined"
            })
        }
        res.status(200).json(product)
    } catch (err) {
        next(err)
    }
}
export const remove = async (req, res, next) => {
    try {
        ProductModel.findByIdAndDelete({
            _id: req.params.id
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: "Не удалось удалить товар"
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: "Товар не найден"
                })
            }
            res.json({
                success: true
            })
        })
    } catch (err) {
        next(err)
    }
}
export const myProducts = async (req, res, next) => {
    try {
        const products = await ProductModel.find({ seller: req.userId })
        res.json(products)
    } catch (err) {
        next(err)
    }
}