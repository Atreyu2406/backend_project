import { Router } from "express";
import ProductManager from "../components/ProductManager.js"

const router = Router()
const product = new ProductManager()
const readProducts = await product.getProducts()

//endpoint para leer todos los productos
router.get("/", (req, res) => {
    res.render("showProducts", {readProducts})
})

//Método GET Query params
router.get("/", async(req, res) => {
    let limit = req.query.limit
    if(!limit) {
        res.send(readProducts)
    } else {
        let amount = await readProducts.slice(0, limit)
        res.send(amount)
    }
})

//Método GET URL params
router.get("/:pid", async(req, res) => {
    let id = req.params.pid
    let product = readProducts.find(item => item.id == id)
    if(!product) return res.status(400).json("ID does not exist")
    res.render("showProduct", product)
})

//Método POST
router.post ("/", async(req, res) => {
    let {title, description, price, code, stock, img} = req.body
    const userCreated = {title, description, price, code, stock, img}
    await product.writeProducts(userCreated)
    res.status(201).json({ message: "User created" })
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
    product.deleteProductsById(id)
    res.status(200).json({ message: "User delete" })
})


export default router