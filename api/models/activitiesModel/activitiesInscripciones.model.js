import {pool} from "../../config/db.js"

export const registerStudentModel = async (id,studentID, activityID) => {

    const cnn = await pool.getConnection();
    await cnn.beginTransaction();

    try  {
        const query = `insert into registro (id,actividad_id,estudiante_id,estado_registro_id, fecha_inscripcion)
                       values (?, ? , ? , 1, NOW())` 

        await cnn.execute(query, [id, activityID, studentID])

        cnn.commit();
        
    } catch (error) {
        cnn.rollback();
        throw error
    }
    finally{
        cnn.release();
    }
}

export const unsubscribeStudentModel = async (studentID, activityID) => {

    const cnn = await pool.getConnection();
    await cnn.beginTransaction();

    try {

        const query = `delete from registro where actividad_id = ? and estudiante_id = ?`

        const [rows] = await cnn.execute(query, [activityID,studentID])

        cnn.commit()

        return rows;

    } catch (error) {
        cnn.rollback();
        throw error;
    } finally {
        cnn.release();
    }
}

export const closeInscriptionsModel = async (activityID) => {

    const cnn = await pool.getConnection();
    await cnn.beginTransaction();

    try{
        
        const query = `update registro set estado_registro_id = 2 where actividad_id = ?`

        const [rows] = await cnn.execute(query, [activityID]);

        cnn.commit();
        return rows;

    } catch (error) {
        cnn.rollback();
        throw error;
    } finally {
        cnn.release();
    }
}
//TODO: Logica Sugerida
        // const query = `update activities
        // set status='finished', endDate=DATE_SUB(NOW(), INTERVAL 12 HOUR)
        // where id = ? and isDeleted='false'`;

        // await pool.query(query, [id]);

export const closeActivityModel = async (activityID) => {

    const cnn = await pool.getConnection();
    await cnn.beginTransaction();

    try{

        const query = ` update actividad set estado_id = 3 where id = ? `

        const [rows] = await cnn.execute(query, [activityID]);
        cnn.commit();   

        return rows;

    } catch (error) {
        cnn.rollback();
        throw error;
    } finally {
        cnn.release();
    }

}

