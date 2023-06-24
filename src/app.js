import express from "express";
import productRouter from "./routers/product.router.js"
import cartRouter from "./routers/cart.router.js"
import multer from "multer";
import handlebars from "express-handlebars"
import { Server } from "socket.io"

const app = express()

//Configuración del contro de plantillas
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

app.use("/api/products", middleware, productRouter)
app.use("api/cart", cartRouter)

//http://localhost:8080/
app.get("/", async (req, res) => res.send("Inicializando..."))
app.post("/", uploader.single("file"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ status: "error", message: "No file" })
    }
    res.json({ status: "success", message: "File uploaded"})
})

//Configuración socket
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



/*

import express from "express"

let users = [
    { id: 1, name: "Damian", age: 40}, 
    { id: 2, name: "Damian", age: 40}, 
    { id: 3, name: "Damian", age: 40}, 
    { id: 4, name: "Damian", age: 40}, 
]

const cursos = [
    { id: 1, name: "Damian", age: 40}, 
    { id: 2, name: "Damian", age: 40}, 
    { id: 3, name: "Damian", age: 40}, 
    { id: 4, name: "Damian", age: 40}, 
]

const app = express ()
app.use(express.json())//middleware

app.get ("/", (req, res) => res.status(202).json({message: "Server OK"}))
app.get ("/users", (req, res) => {
    const limit = req.query.limit
    if (limit > users.length || limit == 0) {
        res.status(400).json({error: "Limit is invalid"})
    } else {
        res.status(200).json({users: users.slice(0, limit)})
    }
})
app.get("/cursos", (req, res) => {
    res.status(200).json({cursos})
})

//Método POST
app.post ("/users", (req, res) => {
    const { id, name, age } = req.body
    if (!id || !name || !age) {
        return res.status(400).json({ error: "Same fields missing"})
    }
    const userCreated = { id, name, age }
    users.push(userCreated)
    res.status(201).json({ message: "User created!", data: userCreated })
})

//Método DELETE
app.delete ("/users/:id", (req, res) => {
    const id = req.params.id
    users = users.filter(item => item.id != id)
    res.status(200).json({ message: "User deleted" })
})

//Método USER
app.put ("/users/:id", (req, res) => {
    const id = req.params.id
    const newData = req.body
    const user = users.find(item => item.id == id)
    const userIndex = users.findIndex(item => item.id == id)
    users[userIndex] = {
        ...user,
        ...newData //spread operator
    }
    res.status(200).json({ message: "User update!"})
})

app.listen (8080, () => console.log("Server Up..."))

*/