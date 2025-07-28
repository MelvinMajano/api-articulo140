import {pool} from "../config/db.js"

export const getActividadModel =async()=>{
    const query =`select *from actividad`;

    const [rows] = await pool.query(query);
    return rows;
}

export const crearActividadModel =async(data)=>{
    const {id,titulo,descripcion,carreraid,fecha_inicio,fecha_fin,horasVoae,
cuposDisponibles,supervisorId,estadoId,ambitoId}= data;
    
    const conn = await pool.getConnection();
    try {
    await conn.beginTransaction();
        const query = `insert into actividad(id,titulo,descripcion,carrera_id,fecha_inicio,fecha_fin,horasVoae,
cupos_Disponibles,supervisor_id,estado_id)
    values(?,?,?,?,?,?,?,?,?,?)`;

    await conn.execute(query,[id,titulo,descripcion,carreraid,fecha_inicio,fecha_fin,horasVoae,
cuposDisponibles,supervisorId,estadoId]);

    ambitoId.forEach( async (ambito) => {
        const queryActividad_ambito = `insert into actividad_ambito(actividad_id,ambito_id)
        values(?,?)`;
        await conn.execute(queryActividad_ambito,[id,ambito]);
    });

    conn.commit();
    return;
    } catch (error) {
        conn.rollback();
        throw error;
    }finally{
        conn.release();
    }

}

export const getActividadbyIdModel =async(id)=>{
    const query =`select *from actividad
    where id = ?`;

    const [rows] = await pool.query(query,[id]);
    return rows;
}

export const putActividadbyidModel =async(id,data)=>{
    const {titulo,descripcion,fecha_inicio,fecha_fin,horasVoae,
cuposDisponibles,supervisorId,ambitoId}= data;

    const query = `update actividad 
    set titulo=?,descripcion=?,fecha_inicio=?,fecha_fin=?,horasVoae=?,
cupos_Disponibles=?,supervisor_id=? 
where id=?`;
    
    await pool.query(query,[titulo,descripcion,fecha_inicio,fecha_fin,horasVoae,
cuposDisponibles,supervisorId]);

    

}
