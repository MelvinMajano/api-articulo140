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
    COALESCE(SUM(CASE WHEN s.scope = 'cultural' THEN at.hoursAwarded ELSE 0 END), 0) AS culturalHours,
    COALESCE(SUM(CASE WHEN s.scope = 'cientificoAcademico' THEN at.hoursAwarded ELSE 0 END), 0) AS cientificoAcademicoHours,
    COALESCE(SUM(CASE WHEN s.scope = 'deportivo' THEN at.hoursAwarded ELSE 0 END), 0) AS deportivoHours,
    COALESCE(SUM(CASE WHEN s.scope = 'social' THEN at.hoursAwarded ELSE 0 END), 0) AS socialHours,
    COALESCE(SUM(at.hoursAwarded), 0) AS totalHours
FROM users u
LEFT JOIN registrations r 
    ON u.id = r.studentId
LEFT JOIN attendances at
    ON r.studentId = at.studentId 
    AND r.activityId = at.activityId
LEFT JOIN activities a 
    ON r.activityId = a.id 
    AND a.status = 'finished'
LEFT JOIN activityScopes s
    ON a.id = s.activityId
    WHERE 
        u.id = ?
        OR u.accountNumber = ?
        OR u.identityNumber = ?
    GROUP BY u.id, u.name
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

    const query = `select u.id, u.name, u.email, u.accountNumber, u.identityNumber, d.name as career, u.isDeleted from users as u
   inner join degrees as d on u.degreeId = d.id
   where u.role = 'supervisor'`

    const [result] = await cnn.query(query)

    return result
}

export const getCareersModel = async () => {

    const cnn = await pool.getConnection()

    const query = `select d.id, d.code, d.name, d.faculty from degrees as d`

    const [result] = await cnn.query(query)

    return result
}

export const disableSupervisorModel = async (id) => {

    const cnn = await pool.getConnection()

    const query = `update users set isDeleted = true where accountNumber = ? and role = 'supervisor'`
    const [result] = await cnn.query(query, [id])
    return result
}

export const enableSupervisorModel = async (id) => {

    const cnn = await pool.getConnection()

    const query = `update users set isDeleted = 'false' where accountNumber = ? and role = 'supervisor'`
    const [result] = await cnn.query(query, [id])
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