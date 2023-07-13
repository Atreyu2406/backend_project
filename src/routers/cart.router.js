import { Router } from "express";
import CartManager from "../dao/fsManagers/CartManager.js"


const router = Router()
const cart = new CartManager()

router.get("/", async(req, res) => {
    res.json(await cart.getCarts())
})

router.get("/:cid", async(req, res) => {
    let id = req.params.cid
    let cartById = await cart.getCartsById(id)
    res.json(cartById)
})

router.post("/", async(req, res) => {
    let newCart = req.body
    let result = await cart.addCarts(newCart)
    res.status(201).json({ status: "success", payload: result })
})

router.post("/:cid/products/:pid", async(req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    let result = await cart.addProductInCart(cartId, productId)
    res.status(201).json({ status: "success", payload: result })
})

export default router