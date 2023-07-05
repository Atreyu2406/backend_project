import { Router } from "express";
import ProductManager from "../components/ProductManager.js"

const router = Router()
const product = new ProductManager()
const readProducts = await product.readProducts()

//endpoint para leer todos los productos
router.get("/", async (req, res) => {
    // res.render("showProducts", {readProducts})
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
    res.status(201).json({ status: "success", payload: result})
})

//Método PUT
router.put("/:pid", (req, res) => {
    const id = parseInt(req.params.pid)
    const newData = req.body
    product.updateProducts({id, ...newData})
    res.status(200).json({ message: "User update!" })
})

//Método DELETE
router.delete("/:pid", async(req, res) => {
    const id = req.params.pid
    let result = await product.deleteProductsById(id)
    res.status(200).json({ status: "success", payload: result })
})


export default router