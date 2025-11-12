import { IDv, NumbersV } from "../schemas/Auth.Schema.js"
import { userExist } from "../models/auth.model.js"
import { CurrentActivitiesDB, VOAEHours, getStudentsModel,getSupervisorsModel,disableSupervisorModel,enableSupervisorModel,getCareersModel,registerActivityForStudentModel } from "../models/users.model.js"
import { validateActivityForUser } from "../schemas/ActivitiesSchema/activitiesSchema.js"
import { validateResult, validateUserDb } from "../utils/validations.js"
import { v4 as uuidv4 } from "uuid";
import { successResponse,erroResponse } from "../utils/responseHandler.js"


export default class UserController{

    static GetUserActivity = async (req,res)=>{
        const id = Object.values(req.params)[0];
        const data=id
       try{

       
         const filter  = await NumbersV(data)
        if(validateResult(filter,res)) return
        
       
        
        const Exist = await userExist(id)
       

        if(validateUserDb(Exist,res))return
          
        const result = await CurrentActivitiesDB(id)
        
        if(result.length===0){
            return successResponse(res,200,"No ha realizado actividades previamente") 
        }
        
        if(result){
          return  successResponse(res,201,"Actividades",result)
        }

       }catch(error){
        return erroResponse(res,500,"Error al visualizar actividades",error)
       }


    }

    static ActivitiesScope = async (req , res)=>{

       const id = Object.values(req.params)[0];
        const data=id

      try {

        const filter  = await NumbersV(data)

        if(validateResult(filter,res)) return

        const Exist = await userExist(id)
        if(validateUserDb(Exist,res))return
                
                
        const result  = await VOAEHours(id)
        
        if(result.length===0){
             return successResponse(res,200,"No ha Adquirido Horas VOAE")
        }
        
        
        
        if(result){
            return successResponse(res,200,"Horas VOAE Adquiridas:",result)
        }
        
      } catch (error) {
        return erroResponse(res,500,"Error al visualizar Horas VOAE",error)
      }


    }

    static getStudents =  async (req,res) => {

      try{

        const students = await getStudentsModel()

        if (students.length === 0){
            return erroResponse (res,404,"No hay estudiantes registrados")
        }

        return successResponse(res,200,"Estudiantes:",students)


      }catch (error){
        return erroResponse(res,500,"Error al obtener estudiantes",error)
      }
    }

    static getSupervisors =  async (req,res) => {

      try{

        const supervisors = await getSupervisorsModel()

        if (supervisors.length === 0){
            return erroResponse (res,404,"No hay supervisores registrados")
        }

        return successResponse(res,200,"Supervisores:",supervisors)


      }catch (error){
        return erroResponse(res,500,"Error al obtener supervisores",error)
      }
    }

    static disableSupervisor = async (req,res) => {

      const {accountNumber} = req.params

     try {

       const result = await disableSupervisorModel(accountNumber)

       if (result.affectedRows === 0) {
         return erroResponse(res,404,"Supervisor no encontrado")
       }

       return successResponse(res,200,"Supervisor actualizado con éxito")

     } catch (error) {
       return erroResponse(res,500,"Error al actualizar supervisor",error)
     }
   }

   static enableSupervisor = async (req,res) => {

      const {accountNumber} = req.params

     try {

       const result = await enableSupervisorModel(accountNumber)

       if (result.affectedRows === 0) {
         return erroResponse(res,404,"Supervisor no encontrado")
       }

       return successResponse(res,200,"Supervisor actualizado con éxito")

     } catch (error) {
       return erroResponse(res,500,"Error al actualizar supervisor",error)
     }
   }

     static getCareers =  async (req,res) => {

      try{

        const careers = await getCareersModel()

        if (careers.length === 0){
            return erroResponse (res,404,"No hay carreras registradas")
        }

        return successResponse(res,200,"Carreras:",careers)

      }catch (error){
        return erroResponse(res,500,"Error al obtener carreras",error)
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
                return erroResponse(res,400,"Error en los datos",error)
            }

            filteredData.id = uuidv4();
            filteredData.status = "finished"
            filteredData.availableSpots = 0

            const response = await registerActivityForStudentModel(filteredData,id)

            return successResponse(res,201,"Actividad registrada con éxito",response)

            

        } catch (error) {
            return erroResponse(res,500,"Error al registrar actividad",error)
        }
    };
}


