import express from "express"
import cors from "cors"

const app=express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors({
    
    methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bearer', 'api-key']

}))

app.use((req,res)=>{
    res.status(404).json({message:`${req.url} no fue encontrada`})
})

app.listen(PORT,()=>{
    console.log(`Server running on port localhost:${PORT}`)
})