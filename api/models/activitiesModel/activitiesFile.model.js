import {pool} from "../../config/db.js"

export const postActivitiesFilesModel = async(file)=>{
    const {id,actividad_id,nombre_archivo,url}=file;
    const query = `insert into archivos(id,actividad_id,nombre_archivo,url) values(?,?,?,?)`

    await pool.query(query,[id,actividad_id,nombre_archivo,url]);
}

export const getActivitiesFilesModel = async(id)=>{
    const query = `select *from archivos where actividad_id = ?`;
    const [rows] = await pool.query(query,[id])
    return rows[0];
}