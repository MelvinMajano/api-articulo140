import {pool} from "../../config/db.js"

export const studentExists = async (studentID) => {

    const cnn = await pool.getConnection();

    const [rows] = await cnn.execute(`select * from users where id = ?`, [studentID]);
    
    return rows
}

export const activityExists = async (activityID) => {

    const cnn = await pool.getConnection();

    const [rows] = await cnn.execute(`select * from activities where id = ?`, [activityID]);

    return rows
}

export const registerStudentModel = async (studentID, activityID) => {

    const cnn = await pool.getConnection();
    await cnn.beginTransaction();

     const query = `insert into registrations (studentId,activityId, registrationDate)
                    values (?, ?, CURDATE())`;

    try  {

        await cnn.execute(query, [studentID, activityID])

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

    const query = `delete from registrations where studentId = ? and activityId = ?`

    try {

        await cnn.execute(query, [studentID, activityID])

        cnn.commit()


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

        const query = `update activities set status = 2 where id = ?`;

        await cnn.execute(query, [activityID]);

        cnn.commit();


    } catch (error) {
        cnn.rollback();
        throw error;
    } finally {
        cnn.release();
    }
}

        

export const closeActivityModel = async (activityID) => {

    const cnn = await pool.getConnection();
    await cnn.beginTransaction();

    try{

        const query = `update activities
        set status='finished', endDate=DATE_SUB(NOW(), INTERVAL 12 HOUR)
        where id = ? and isDeleted='false'`;

        await cnn.execute(query, [activityID]);
        cnn.commit();

    } catch (error) {
        cnn.rollback();
        throw error;
    } finally {
        cnn.release();
    }

}

