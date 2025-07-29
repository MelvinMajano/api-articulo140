import {pool} from "../../config/db.js"

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