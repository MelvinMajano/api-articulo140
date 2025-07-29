import {pool} from "../config/db.js"

export const getActividadModel =async()=>{
    const conn = await pool.getConnection();
    try {
        const query = `select a.titulo, a.descripcion, a.fecha_inicio, a.fecha_fin, a.horasVoae, a.cupos_disponibles, u.nombre as Supervisor, e.nombre as Estado from actividad as a
                       inner join users as u on a.supervisor_id = u.id
                       inner join estado as e on a.estado_id = e.id`;

        const [rows] = await conn.execute(query);

        return rows;

    }
    catch (error) {
        throw error;
    } finally {
        conn.release();
    }
}


export const getActividadbyIdModel =async(id)=>{

    const conn = await pool.getConnection();

    try {
    const query =`select a.titulo, a.descripcion, a.fecha_inicio, a.fecha_fin, a.horasVoae, a.cupos_disponibles, u.nombre as Supervisor, e.nombre as Estado from actividad as a
                  inner join users as u on a.supervisor_id = u.id
                  inner join estado as e on a.estado_id = e.id
                  where a.id = ?`;

    const [rows] = await conn.query(query,[id]);
    return rows;
    }
    catch (error) {
        throw error;
    } finally {
        conn.release();
    }
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


export const registerStudentModel = async (studentID, activityID) => {

    const cnn = await pool.getConnection();
    await cnn.beginTransaction();

    try  {
        const query = `insert into registro (id,actividad_id,estudiante_id,estado_registro_id, fecha_inscripcion)
                       values (uuid(), ? , ? , 1, CURDATE())` 

        await cnn.execute(query, [activityID, studentID])

        cnn.commit();
        
    } catch (error) {
        cnn.rollback();
        throw error
    }
    finally{
        cnn.release();
    }

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
