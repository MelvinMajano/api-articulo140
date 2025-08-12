import {v4 as uuidv4} from "uuid"
import { RegisterUserBD,GetUserByEmailDB, VerifyPasswordDB,ChangePassDb,userExist, AdminChangeDb, UpdateDataDB,DeleteUserDB } from "../models/auth.model.js"
import { FilterData,LoginData,UpdateP,UpdateD, IDv} from "../schemas/Auth.Schema.js"
import bcrypt from "bcrypt"
import {Resend} from "resend"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken' 
import { validateResult,validateUserDb } from "../utils/validations.js"

export default class AuthController {



    static  RegisterUser = async (req,res)=>{
        const {name,email,password,accountNumber,identityNumber,role,degreeId} = req.body
        const data={name,email,password,accountNumber,identityNumber,role,degreeId}
        
        try{

            const filter = await FilterData(data)
            
           if(validateResult(filter,res)) return
        const id = uuidv4()
        
        
        const hash_password = await bcrypt.hash(password, 10)
        
            
            
           
            const resultado = await RegisterUserBD([id,name,email,hash_password,accountNumber,identityNumber,role,degreeId])
            
            
          
            if(resultado){
                res.status(201).json({message:"Registro con Exito",resultado})
            }
        }catch(error){
                      return   res.status(500).json({message: 'Error al registrar usuario', error});

            
        }

    }

   
static LoginUser = async (req, res) => {
    const { email, password } = req.body;
    const data = { email, password };

    try {
        
        const filter = await LoginData(data);
        if(validateResult(filter,res)) return

        
        const user = await GetUserByEmailDB(email); 
        
        
        if(validateUserDb(user,res)) return

        
        const match = await bcrypt.compare(password, user[0].password);
        
        if (!match) {
            return res.status(401).json({ message: "Contraseña o Correo incorrecto " });
        }

        
        const payload = {
            email: user[0].email,
            role: user[0].role,
            id : user[0].id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            token: token,
        });

    } catch (error) {
        return res.status(500).json({ message: "Error en el login", error });
    }
}


static UpdatePassword = async (req,res)=>{

    const {authorization} = req.headers
    const{password , NewPassword } = req.body
    const {id} = req.params
    const data={password,NewPassword}

    

    

    

    try{


        const exist = await userExist(id)
        const filter = await UpdateP(data)

        if(validateUserDb(exist,res)) return        
        if(validateResult(filter,res)) return

        const token = authorization.split(' ')[1]
       
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        

        
        
        const hash_password_New = await bcrypt.hash(NewPassword,10)
        
        
        const Pass = await VerifyPasswordDB(decoded.email,decoded.id)

        console.log(Pass)

        if(!Pass || Pass.length===0){
             return res.status(404).json({ message: "Contraseña no concuerda" });
        }
        
        const match = await bcrypt.compare(password, Pass[0].password);
        
        if (!match) {
            return res.status(401).json({ message: "Contraseña No coincide " });
        }
        


        console.log(hash_password_New,decoded.id)
        const resultado = await ChangePassDb(hash_password_New,decoded.id)
        console.log("paso")

        if(resultado){
                res.status(201).json({message:"Contraseña Actualizada conn Exito ",resultado})
            }
        

        


    }catch(error){return res.status(500).json({ message: "Error Al cambiar Contraseña", error });}


    
}

static UpdateData = async (req,res)=>{
    let {id:ID,name,email,degreeId,role} = req.body
    const {id} =  req.params
    const {authorization} = req.headers
    const data={ID,name,email,degreeId,role}

    try{

        const filter = await UpdateD(data)
         if(validateResult(filter,res)) return

        const token  = authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const Exist = await userExist(id)
        
        if(validateUserDb(Exist,res)) return

        if(decoded.role ==="admin" && name !==undefined){

            const result = await AdminChangeDb(ID,role)
            

            return res.status(201).json({message:"Actualizacion de Rol Exitosa"})

        }
        console.log(Exist)
        if(name === undefined){name=Exist[0].name}
        if(email === undefined){email=Exist[0].email}
        if(degreeId===undefined){degreeId=Exist[0].degreeId}

        console.log(name,email,degreeId)
        const Update = await UpdateDataDB(name,email,degreeId,id)
       
        if(Update){
                res.status(201).json({message:"Actualizacion de Datos con Exito  ",Update})
            }


        

        
    }catch(error){
        return res.status(500).json({ message: "Error Al Actualizar Datos", error });}
}

static DeleteUser=async (req,res)=>{

    const {id}=req.params
    const data={id}
   try{
     const filter  = await IDv(data)

     if(validateResult(filter,res)) return
    
    const Exist = await userExist(id)
        
    if(validateUserDb(user,res)) return
        
    const result = await DeleteUserDB(id)   
    

    if(result){
                res.status(201).json({message:"Actualizacion de Datos con Exito  ",result})
            }

   }catch(error){ return res.status(500).json({ message: "Error Al Eliminar Usuario", error })}




}



}