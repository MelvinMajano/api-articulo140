import { pool } from "../../config/db.js";

export const registerAttendanceModel = async (data) => {
  const { registro_id, hora_entrada, hora_salida } = data;
  const cnn = await pool.getConnection();

  try {
    await cnn.beginTransaction();

    const query = `insert into asistencia(id,registro_id,hora_entrada,hora_salida,created_at) 
                   values (UUID(), ? , ? , ? , CURDATE())`;

    const [rows] = await cnn.execute(query, [registro_id, hora_entrada, hora_salida]);

    cnn.commit();
    return rows;

  } catch (error) {
    cnn.rollback();
    throw error;
  } finally {
    cnn.release();
  }
};
