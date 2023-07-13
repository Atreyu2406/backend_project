import express from "express";
import productRouter from "./routers/product.router.js"
import cartRouter from "./routers/cart.router.js"
import multer from "multer";
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"

const app = express()

// Configuración del control de plantillas
app.engine("handlebars", handlebars.engine())
app.set("views", "./src/views")
app.set("view engine", "handlebars")

//endpoint extenso o complejo lo lee de manera correcta
app.use(express.urlencoded({ extended: true })) 
app.use(express.json())
app.use(express.static("./src/public"))

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "src/public/")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const uploader = multer({ storage })

const middleware = (req, res, next) => {
    console.log("Middleware funcionando!")
    next()
}

// app.use("/products", viewRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)

//http://localhost:8080/
app.get("/", async (req, res) => res.send("Inicializando..."))
app.post("/", uploader.single("file"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ status: "error", message: "No file" })
    }
    res.json({ status: "success", message: "File uploaded"})
})

//Configuración Mongoose
mongoose.set("strictQuery", false)
await mongoose.connect('mongodb+srv://atreyu2406:benja2012@cluster0.2dskaxd.mongodb.net/ecommerce', {
    useUnifiedTopology: true
})
  
// Configuración Websockets
const serverHttp = app.listen(8080, () => console.log("Server up..."))
const io = new Server(serverHttp)

const log = []

io.on(`connection`, socket => {
    console.log("Se ha realizado una conexión")
    socket.broadcast.emit("alert")
    socket.emit("history", log)
    socket.on("message", data => {
        log.push(data)
        io.emit("history", log)
    })
})