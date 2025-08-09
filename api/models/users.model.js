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

