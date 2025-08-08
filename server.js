import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import activitiesRouter from "./api/routes/activities.routes.js";
import "./api/utils/activities/statusUpdater.js"
import AuthRouter from "./api/routes/auth.routes.js";


const app=express()

dotenv.config();

const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors({
    
    methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bearer', 'api-key']

}))

app.use('/api/activities',activitiesRouter)
app.use("/api/auth",AuthRouter)
app.use("/api/users")


app.use((req,res)=>{
    res.status(404).json({message:`${req.url} no fue encontrada`})
})

app.listen(PORT,()=>{
    console.log(`Server running on port localhost:${PORT}`)
})