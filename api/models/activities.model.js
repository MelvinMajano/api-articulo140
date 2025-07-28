import {pool} from "../config/db.js"

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
