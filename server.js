import { Server} from 'socket.io'
import http from "http"
import express from "express"
import dotenv from "dotenv"
import { connection } from "./db/db.config.js"
import Document from "./models/documentSchema.js"
import path from 'path'


dotenv.config()

const app = express()

const server = http.createServer(app)

const __dirname1 = path.resolve()

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname1,"/client/dist")))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"client","dist","index.html"))
    })
} else{
    app.get('/',(req,res)=>{
        res.send('API Running Successfully !')
    })
}


connection.once('open',()=>{
    console.log('Connected to MongoDb Database');
})


const io  = new Server(server,{
    cors :{
        origin : "*"
    }
})



io.on('connection',(socket)=>{
    console.log('Connected');
    socket.on('get-document', async documentId =>{
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit('load-document',document.data)
        socket.on('send-changes', delta =>{
            socket.broadcast.to(documentId).emit('receive-changes',delta)
        })

        socket.on('save-document', async (data) => {
            await Document.findByIdAndUpdate(documentId,{data});            
          });
    })
})

const defaultValue = ""

const findOrCreateDocument = async (id)=>{
    if(id == null) return

    const document = await Document.findById(id)

    if(document) return document

    return await Document.create({ _id : id , data : defaultValue})
}


server.listen(5000,()=>{
    console.log('Server Started');
})
