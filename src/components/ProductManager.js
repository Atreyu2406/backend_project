import { json } from "express"
import fs, { read } from "fs"

export default class ProductManager {
    #products
    constructor() {
        this.#products = []
        this.path = "./products.json"
        this.format = "utf-8"
    }

    writeProducts = async(product) => {
        let products = await this.readProducts()
        let productsAll = [ ...products, product ]
        await fs.promises.writeFile(this.path, JSON.stringify(productsAll))
        return "Producto agregado"
    }

    readProducts = async() => {
        let readProd = JSON.parse(await fs.promises.readFile(this.path, this.format))
        return readProd
    }

    getProducts = async() => {
        let getProd = await this.readProducts()
        return getProd
    }

    getProductsById = async(id) => {
        let getProdById = await this.readProducts()
        const product = getProdById.find(item => item.id === id)
        if (!product) return console.log("Not Found ID")
        return console.log(product)
    }

    // #generateId = () => (this.#products.length === 0 ? 1 : this.#products[this.#products.length-1].id + 1)

    // #validate = (title, description, price, code, stock, img) => {
    //     if (!title || !description || !price || !code || !stock || !img) {
    //         return `[${title}]: Campos Incompletos`
    //     } else {
    //         const found = this.#products.find(item => item.code === code)
    //         if (!found) return true
    //         return `[${title}]: El código ya existe`
    //     }
    // }
        
    addProducts = async(title, description, price, code, stock, img) => {
        // if ((this.#validate(title, description, price, code, stock, img) === true)) {
            this.#products.push({title, description, price, code, stock, img}) 
            console.log(this.#products)
            return await fs.promises.writeFile(this.path, JSON.stringify(this.#products, null, `\t`))
    }
    //     } else {
    //         console.log(this.#validate(title, description, price, code, stock, img))
    //     }
    // }

    deleteProductsById = async(id) => {
        let deleteProdById = await this.readProducts()
        let productDelete = deleteProdById.filter(item => item.id != id)
        return await fs.promises.writeFile(this.path, JSON.stringify(productDelete, null, `\t`))
    }

    updateProducts = async({ id, ...product}) => {
        await this.deleteProductsById(id);
        let updateDb = await this.readProducts()
        let updateProd = [{id, ...product}, ...updateDb]
        return await fs.promises.writeFile(this.path, JSON.stringify(updateProd, null, `\t`))
    }
}

const product = new ProductManager()



/*

//Producto eliminado
product.deleteProducts(1)

//Agregar productos
product.addProducts("Harry Potter", "Película género fantástico", "12500", "4522", "2", "img.jpg")
product.addProducts("Indiana Jones", "Película aventura", "9500", "4523", "7", "img2.jpg")
product.addProducts("Sherlock Holmes", "Película detectives", "8000", "4524", "14", "img3.jpg")
product.addProducts("The Witcher", "Película género fantástico", "5000", "4525", "4", "img4.jpg")

//Busqueda de productos por ID
// product.getProductsById(2)
// product.getProductsById(4)

//Actualizar producto
// product.updateProducts({
//     id: 1,
//     title: 'Bananas',
//     description: 'Libro género fantástico',
//     price: '8000',
//     code: '2574',
//     stock: '12',
//     img: 'https://http2.mlstatic.com/D_NQ_NP_941946-MLA46913432105_072021-V.jpg'
// })

//Lista de Productos
// product.getProducts()

*/