import { json } from "express"
import fs, { existsSync, read } from "fs"
import { nanoid } from "nanoid"

export default class ProductManager {
    #products
    constructor() {
        this.#products = []
        this.path = "./products.json"
        this.format = "utf-8"
    }


    writeProducts = async(product) => {
        await fs.promises.writeFile(this.path, JSON.stringify(product, null, 2))
    }
    
    readProducts = async() => {
        let products = JSON.parse(await fs.promises.readFile(this.path, this.format))
        return products
    }

    addProducts = async(product) => {
        let products = await this.readProducts()
        product.id = nanoid()
        let productsAll = [ ...products, product ]
        await this.writeProducts(productsAll)
        return productsAll
    }

    getProducts = async() => {
        return await this.readProducts()
    }

    getProductsById = async(id) => {
        let products = await this.readProducts()
        let productById = products.find(item => item.id === id)
        if (!productById) return ({ message: "Not Found ID" })
        return productById
    }

    deleteProductsById = async(id) => {
        let products = await this.readProducts()
        let existsProduct = products.some(prod => prod.id === id)
        if (!existsProduct) return "[ERR] Product Not Found"
        let productDelete = products.filter(item => item.id != id)
        await this.writeProducts(productDelete)
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

product.addProducts("Jack Skellington", "The Pumpkin King has brought Halloween to Halloween Town, but now he is ready to herald in the spirit of a merrier holiday. Help Pop! Jack Skellington break down the science of Christmas as he studies the holiday’s joyous traditions in his lab. Celebrate the 30th Anniversary of The Nightmare Before Christmas with Pop! Jack Skellington. He is simply meant to be in your collection! Vinyl figure is approximately 4.4-inches tall.", 12500, "", true, "POP001", 3, "Funko Pop")
product.addProducts("Master Roshi", "Every Dragon Ball Z collection needs to have Goku’s old instructor, Master Roshi. Collect this Pop! of Master Roshi with his staff to help your Dragon Ball Z collection keep up with their training. Collectible stands 3.75-inches tall.", 10500, "", true, "POP002", 12, "Funko Pop")
product.addProducts("Chucky", "Schedule a playdate with Bride of Chucky Pop! Chucky. Capture him to haunt your Pop! Movies collection. Vinyl figure is approximately 4-inches tall.", 9800, "", true, "POP003", 23, "Funko Pop")

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