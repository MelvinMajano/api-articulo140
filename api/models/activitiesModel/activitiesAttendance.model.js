import { pool } from "../../config/db.js";

export const registerAttendanceModel = async (data) => {
  const {id, registro_id, hora_entrada, hora_salida } = data;
  const cnn = await pool.getConnection();

  try {
    await cnn.beginTransaction();

    const query = `insert into asistencia(id,registro_id,hora_entrada,hora_salida,created_at) 
                   values (?, ? , ? , ? , NOW())`;

    const [rows] = await cnn.execute(query, [id, registro_id, hora_entrada, hora_salida]);

    cnn.commit();
    return rows;

  } catch (error) {
    cnn.rollback();
    throw error;
  } finally {
    cnn.release();
  }
};

export const getAttendanceModel = async (activityID) => {

  const cnn = await pool.getConnection()

  try{

    const query = `select a.titulo,u.nombre, u.numero_cuenta ,asist.hora_entrada, asist.hora_salida 
                   from actividad as a 
                   inner join registro as r on a.id = r.actividad_id
                   inner join users as u on u.id = r.estudiante_id
                   left join asistencia as asist on asist.registro_id = r.id
                   where a.id = ?`

    const [rows] = await cnn.execute(query, [activityID])
    return rows

  } catch(error) {
    throw error;
  }
}

export const updateAttendanceModel = async (activityID, userID, data) => {

  const { hora_entrada, hora_salida } = data;
  const cnn = await pool.getConnection();

  cnn.beginTransaction();

  try{

    const query = `update asistencia as a 
                   join registro as r on a.registro_id = r.id
                   join actividad as act on act.id = r.actividad_id
                   set hora_entrada = ? , hora_salida = ?
                   where act.id = ? and r.estudiante_id = ?`

    const [rows] = await cnn.execute(query, [hora_entrada,hora_salida,activityID,userID])

    await cnn.commit();
    return rows;

  } catch (error) {
    cnn.rollback();
    throw error;
  } finally {
    cnn.release();  
  }
}
