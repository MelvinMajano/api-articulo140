import { IDv } from "../schemas/Auth.Schema.js"
import { userExist } from "../models/auth.model.js"
import { CurrentActivitiesDB, VOAEHours } from "../models/users.model.js"
import { id } from "zod/locales"
import { validateResult, validateUserDb } from "../utils/validations.js"


export default class UserController{

    static GetUserActivity = async (req,res)=>{
        const {id} = req.params
        const data={id}
       try{
         const filter  = await IDv(data)
        if(validateResult(filter,res)) return
        
        const Exist = await userExist(id)

        if(validateUserDb(Exist,res))return
          
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

    static ActivitiesScope = async (req , res)=>{

      const  {id} = req.params
      const data = {id}

      try {

        const filter  = await IDv(data)

        if(validateResult(filter,res)) return

        const Exist = await userExist(id)
        if(validateUserDb(Exist,res))return
                
                
        const result  = await VOAEHours(id)
        
        if(result.length===0){
            return res.status(200).json({message:"No ha Adquirido Horas VOAE AUN"})
        }
        
        if(result){
            return res.status(201).json({message:"Horas VOAE",result})
        }
        
      } catch (error) {
        return res.status(500).json({ message: "Error al visualizar Horas VOAE", error })
      }


    }
}