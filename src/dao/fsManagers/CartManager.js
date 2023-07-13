import { json } from "express"
import fs, { existsSync, read } from "fs"
import { nanoid } from "nanoid"
import ProductManager from "./ProductManager.js"

export default class CartManager {
    constructor() {
        this.path = "./carts.json"
        this.format = "utf-8"
    }

    writeCarts = async(cart) => {
        await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2))
    }
    
    readCarts = async() => {
        let carts = JSON.parse(await fs.promises.readFile(this.path, this.format))
        return carts
    }

    exists = async(id) => {
        let carts = await this.readCarts()
        return carts.find(item => item.id === id)
    }

    getCarts = async() => {
        return await this.readCarts()
    }

    getCartsById = async(id) => {
        let carts = await this.readCarts()
        let cartById = carts.find(item => item.id === id)
        if (!cartById) return ({ message: "Not Found ID" })
        return cartById
    }

    addCarts = async() => {
        let carts = await this.readCarts()
        let id = nanoid(3)
        let result = [{ id: id, products: [] }, ...carts]
        await this.writeCarts(result)
        return result
    }

    addProductInCart = async(cartId, productId) => {
        let cartById = await this.exists(cartId)
        if (!cartById) return ({ message: "Not Found ID" })
        let productById = await product.exists(productId)
        if (!productById) return ({ message: "Not Found ID" })
        
        let cartsAll = await this.readCarts()
        let cartFilter = cartsAll.filter(item => item.id != cartId)

        if(cartById.products.some(item => item.id === productId)) {
            let moreProductInCart = cartById.products.find(item => item.id === productId)
            moreProductInCart.amount++
            console.log(moreProductInCart.amount)
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
        }

        cartById.products.push({ id: productById.id, amount: 1})

        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat)
    }
}

const product = new ProductManager()