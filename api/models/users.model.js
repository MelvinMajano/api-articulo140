import { pool } from "../config/db.js";

export const CurrentActivitiesDB=async (id)=>{
    const query = ` SELECT 
    u.name AS studentName,
    GROUP_CONCAT(a.title ORDER BY a.startDate SEPARATOR ', ') AS activitiesParticipated
FROM registrations r
INNER JOIN activities a 
    ON r.activityId = a.id
INNER JOIN users u
    ON r.studentId = u.id
WHERE u.id = ?
  AND a.status = 'finished'
GROUP BY u.id, u.name;`

    const [result] = await pool.query(query,[id])
    return result
}

export const VOAEHours = async (id)=>{
    const query = `SELECT 
    u.name AS studentName,
    SUM(CASE WHEN s.scope = 'cultural' THEN a.voaeHours ELSE 0 END) AS culturalHours,
    SUM(CASE WHEN s.scope = 'cientificoAcademico' THEN a.voaeHours ELSE 0 END) AS cientificoAcademicoHours,
    SUM(CASE WHEN s.scope = 'deportivo' THEN a.voaeHours ELSE 0 END) AS deportivoHours,
    SUM(CASE WHEN s.scope = 'social' THEN a.voaeHours ELSE 0 END) AS socialHours
FROM registrations r
INNER JOIN activities a 
    ON r.activityId = a.id
INNER JOIN users u
    ON r.studentId = u.id
INNER JOIN activityScopes s
    ON a.id = s.activityId
WHERE u.id = ?
GROUP BY u.name;
`
const [result] = await pool.query(query,[id])
return result
}

export const registerActivityForStudentModel = async(data, studentId) => {

    const cnn = await pool.getConnection();

    await cnn.beginTransaction();

    const {id,title,description,degreeId,startDate,endDate,voaeHours,availableSpots,supervisorId,status,scopesId}= data;

    const query = `insert into activities(id,title,description,degreeId,startDate,endDate,voaeHours,availableSpots,supervisorId,status)
    values(?,?,?,?,?,?,?,?,?,?)`;

    const queryRegistration = `insert into registrations(studentId, activityId) values(?, ?)`;

    try {
        await cnn.query(query, [id,title,description,degreeId,startDate,endDate,voaeHours,availableSpots,supervisorId,status]);

        for (const scope of scopesId) {
            const scopeQuery = `insert into activityScopes(activityId, scope) values(?, ?)`;
            await cnn.query(scopeQuery, [id, scope]);
        }

        await cnn.query(queryRegistration, [studentId, id]);

        await cnn.commit();
    } catch (error) {
        await cnn.rollback();
        throw error;
    } finally {
        cnn.release();
    }

}