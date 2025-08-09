import { IDv } from "../schemas/Auth.Schema.js"
import { userExist } from "../models/auth.model.js"
import { CurrentActivitiesDB } from "../models/users.model.js"

export default class UserController{

    static GetUserActivity = async (req,res)=>{
        const {id} = req.params
        const data={id}
       try{
         const filter  = await IDv(data)

        if (!filter.success) {
            return res.status(400).json({
                message: "Error con el ID",
                errors: filter.error.format(),
            });
        }

        const Exist = await userExist(id)
                
                if(!Exist || Exist.length===0){
                    return res.status(404).json({ message: "usuario no existe" });
                }    
        
                
        const result = await CurrentActivitiesDB(id)
        
        if(result.length===0){
            return res.status(200).json({message:"No ha realizado actividades previamente"})
        }
        
        if(result){
            return res.status(201).json({message:"Actividades",result})
        }

       }catch(error){
        return res.status(500).json({ message: "Error al visualizar Actividades", error });
       }


    }
}