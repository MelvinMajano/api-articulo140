import { pool } from "../../config/db.js";

export const registerAttendanceModel = async (attendances) => {
  
  const cnn = await pool.getConnection();
  const query =  `insert into attendances (id,studentId,activityId,entryTime,exitTime,observations)
                  values (?, ?, ?, ?, ?, ?)`


  try {
    await cnn.beginTransaction();
    
    for (const att of attendances) {

       const { id, studentId, activityId, entryTime, exitTime, observations } = att;

       await cnn.execute(query, [id, studentId, activityId, entryTime, exitTime, observations]);
    }
      
    cnn.commit();

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

    const query = `select u.name, u.accountNumber, u.email, a.entryTime, a.exitTime , a.hoursAwarded, group_concat(ac.scope) as Scope 
                   from attendances as a
                   inner join users as u on u.id = a.studentId
                   inner join activityScopes as ac on ac.activityId = a.activityId
                   where a.activityId = ?
                   group by  u.name, u.accountNumber, u.email, a.entryTime, a.exitTime, a.hoursAwarded;`

    const [rows] = await cnn.execute(query, [activityID])
    return rows

  } catch(error) {
    throw error;
  }
}
