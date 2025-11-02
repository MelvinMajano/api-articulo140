import { pool } from "../config/db.js";

export const CurrentActivitiesDB=async (accountNumber)=>{
    const query = ` SELECT 
    u.name AS studentName,
    GROUP_CONCAT(a.title ORDER BY a.startDate SEPARATOR ', ') AS activitiesParticipated
FROM registrations r
INNER JOIN activities a 
    ON r.activityId = a.id
INNER JOIN users u
    ON r.studentId = u.id
WHERE u.accountNumber = ? or u.id = ? or identityNumber = ?
  AND a.status = 'finished'
GROUP BY u.id, u.name;`

    const [result] = await pool.query(query,[accountNumber,accountNumber,accountNumber])
    return result
}

export const VOAEHours = async (id) => {
   const query = `
SELECT 
    u.name AS studentName,
    SUM(CASE WHEN s.scope = 'cultural' THEN COALESCE(at.hoursAwarded, 0) ELSE 0 END) AS culturalHours,
    SUM(CASE WHEN s.scope = 'cientificoAcademico' THEN COALESCE(at.hoursAwarded, 0) ELSE 0 END) AS cientificoAcademicoHours,
    SUM(CASE WHEN s.scope = 'deportivo' THEN COALESCE(at.hoursAwarded, 0) ELSE 0 END) AS deportivoHours,
    SUM(CASE WHEN s.scope = 'social' THEN COALESCE(at.hoursAwarded, 0) ELSE 0 END) AS socialHours,
    SUM(COALESCE(at.hoursAwarded, 0)) AS totalHours
FROM attendances at
INNER JOIN registrations r
    ON at.studentId = r.studentId 
    AND at.activityId = r.activityId
INNER JOIN activities a 
    ON r.activityId = a.id
INNER JOIN users u
    ON r.studentId = u.id
INNER JOIN activityScopes s
    ON a.id = s.activityId
WHERE a.status = 'finished'
  AND (
       u.id = ? 
       OR u.accountNumber = ? 
       OR u.identityNumber = ?
  )
GROUP BY u.name
ORDER BY u.name;
`;
   const [result] = await pool.query(query, [id, id, id]);
   return result;
};


export const getStudentsModel = async () => {

    const cnn = await pool.getConnection()

    const query = `select u.id,u.name, u.email, u.accountNumber, u.identityNumber, d.name as career from users as u 
   inner join degrees as d on u.degreeId = d.id
   where u.role = 'student' and u.isDeleted = 'false'`

    const [result] = await cnn.query(query)

    return result
}

export const getSupervisorsModel = async () => {

    const cnn = await pool.getConnection()

    const query = `select u.id, u.name, u.email, u.accountNumber, u.identityNumber, d.name as career from users as u
   inner join degrees as d on u.degreeId = d.id
   where u.role = 'supervisor' and u.isDeleted = 'false'`

    const [result] = await cnn.query(query)

    return result
}

export const getCareersModel = async () => {

    const cnn = await pool.getConnection()

    const query = `select d.code, d.name, d.faculty from degrees as d`

    const [result] = await cnn.query(query)

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