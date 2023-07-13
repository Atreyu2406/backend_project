import mongoose, { mongo } from "mongoose";

// const productCollection = "products"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
})

mongoose.set("strictQuery", false)
const productModel = mongoose.model("products", productSchema)

export default productModel