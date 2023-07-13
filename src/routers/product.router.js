import { Router } from "express";
import ProductManager from "../dao/fsManagers/ProductManager.js"

const router = Router()
const product = new ProductManager()
const showProducts = await product.getProducts()

//endpoint para leer todos los productos
router.get("/", async (req, res) => {
    // res.render("showProducts", {showProducts})
    res.json(await product.getProducts())
})

//Método GET Query params
router.get("/", async(req, res) => {
    let limit = req.query.limit
    if(!limit) {
        res.send(readProducts)
    } else {
        let amount = await readProducts.slice(0, limit)
        res.json(amount)
    }
})

//Método GET URL params
router.get("/:pid", async(req, res) => {
    let id = req.params.pid
    let productById = await product.getProductsById(id)
    res.json(productById)
})

//Método POST
router.post ("/", async(req, res) => {
    let newProduct = req.body
    let result = await product.addProducts(newProduct)
    res.status(201).json({ status: "success", payload: result })
})

//Método PUT
router.put("/:pid", async(req, res) => {
    const id = req.params.pid
    const newProduct = req.body
    let result = await product.updateProducts(id, newProduct)
    if(typeof result == "string") return res.json({ status: "error", payload: result })
    res.status(200).json({ status: "success", payload: result })
})

//Método DELETE
router.delete("/:pid", async(req, res) => {
    const id = req.params.pid
    let result = await product.deleteProductsById(id)
    if(typeof result == "string") return res.json({ status: "error", payload: result })
    res.status(200).json({ status: "success", payload: result })
})

export default router