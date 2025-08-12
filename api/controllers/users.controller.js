import { IDv, NumbersV } from "../schemas/Auth.Schema.js"
import { userExist } from "../models/auth.model.js"
import { CurrentActivitiesDB, VOAEHours, registerActivityForStudentModel } from "../models/users.model.js"
import { validateActivityForUser } from "../schemas/ActivitiesSchema/activitiesSchema.js"
import { validateResult, validateUserDb } from "../utils/validations.js"
import { v4 as uuidv4 } from "uuid";
import { handleResponse } from "../utils/responseHandler.js"


export default class UserController{

    static GetUserActivity = async (req,res)=>{
        const {id} = req.params
        const data={id}
       try{

       
         const filter  = await NumbersV(data)
         
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
            return res.status(200).json({message:"Horas VOAE",result})
        }
        
      } catch (error) {
        return res.status(500).json({ message: "Error al visualizar Horas VOAE", error })
      }


    }

    static registerActivityForStudent = async (req, res) => {
        const { id } = req.params;
        const data = req.body

        try {

            const Exist = await userExist(id)
            if(validateUserDb(Exist,res))return

            const {success,error,data: filteredData} = await validateActivityForUser(data)

            if(!success) {
                return res.status(400).json({message:"Error en los datos",error})
            }

            filteredData.id = uuidv4();
            filteredData.status = "finished"
            filteredData.availableSpots = 0

            const response = await registerActivityForStudentModel(filteredData,id)

            return res.status(201).json({ message: "Actividad registrada con éxito", response })

        } catch (error) {
            return res.status(500).json({ message: "Error al registrar actividad", error}) 
        }
    };
}


