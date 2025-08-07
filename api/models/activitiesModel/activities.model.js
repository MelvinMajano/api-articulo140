import {pool} from "../../config/db.js"
import { deshabilitarActividad, habilitarActividad } from "../../utils/activities/estatusManual.js";



export const getActividadModel =async()=>{
    const query = `select a.id, a.title,a.description,a.startDate, a.endDate, a.voaeHours, a.availableSpots,a.status,a.isDeleted, u.name as Supervisor, group_concat(ase.scope) as Scope from activities as a
    inner join users as u on a.supervisorId = u.id
    inner join activityScopes as ase on a.id = ase.activityId
    group by a.id, a.title,a.description, a.startDate, a.endDate, a.voaeHours, a.availableSpots, a.status, u.name, a.isDeleted`;

    const [rows] = await pool.query(query);

    return rows;
}

export const getActividadbyIdModel =async(id)=>{

    const query =`select a.id, a.title,a.description,a.startDate, a.endDate, a.voaeHours, a.availableSpots,a.status,a.isDeleted, u.name as Supervisor, group_concat(ase.scope) as Scope from activities as a
    inner join users as u on a.supervisorId = u.id
    inner join activityScopes as ase on a.id = ase.activityId 
    where a.id = ?
    group by a.id, a.title, a.description, a.startDate, a.endDate, a.voaeHours, a.availableSpots, a.status, u.name, a.isDeleted`;

    const [rows] = await pool.query(query,[id]);
    return rows;
}

export class ValidateCreateActivitiesModel {
    static validateActivitiesModel = async()=>{
        const query = ``;
        const [rows] = pool.query(query,[id]);
        return rows
    }

    static crearActividadModel =async(data)=>{
    const {id,title,description,degreeId,startDate,endDate,voaeHours,availableSpots,supervisorId,status,scopes}= data;
    
    const conn = await pool.getConnection();
    try {
    await conn.beginTransaction();
        const query = `insert into activities(id,title,description,degreeId,startDate,endDate,voaeHours,availableSpots,supervisorId)
    values(?,?,?,?,?,?,?,?,?)`;

    await conn.execute(query,[id,title,description,degreeId,startDate,endDate,voaeHours,availableSpots,supervisorId]);

    // Usar for...of en lugar de forEach para manejar async correctamente
    for (const scope of scopes) {
        const queryActividad_scope = `insert into activityScopes(activityId,scope)
        values(?,?)`;
        await conn.execute(queryActividad_scope,[id,scope]);
    }

    conn.commit();
    return;
    } catch (error) {
        conn.rollback();
        throw error;
    }finally{
        conn.release();
    }

    }
}


export class ValitateUpdateActivitiesModel {
    static validateActivitiesDelete = async(actividadId)=>{
        const queryIsdelete = `select isDeleted from activities where id =?`;
    
        const [rows] = await pool.query(queryIsdelete,[actividadId]);
        return rows[0].isDeleted;
    }

    static putActividadbyidModel =async(data)=>{
    const {actividadId,title,description,startDate,endDate,voaeHours,
    availableSpots,supervisorId,scopes,isDisable}= data;

    const conn = await pool.getConnection();
    try {
    await conn.beginTransaction();
        const query = `update activities
        set title=?,description=?,startDate=?,endDate=?,voaeHours=?,
        availableSpots=?,supervisorId=?
        where id=?`;

    await conn.execute(query,[title,description,startDate,endDate,voaeHours,
availableSpots,supervisorId,actividadId]);

    const queryDeleteAmbito= `Delete from activityScopes where activityId=?`
    await conn.execute(queryDeleteAmbito,[actividadId])
    for (const scope of scopes) {
        const queryActividad_scope = `insert into activityScopes(activityId,scope)
        values(?,?)`;
        await conn.execute(queryActividad_scope,[actividadId,scope]);
    }

    await deshabilitarActividad(isDisable, actividadId, conn);
    await habilitarActividad(isDisable, actividadId, conn);

    conn.commit();
    return data;
    } catch (error) {
        conn.rollback();
        throw error;
    }finally{
        conn.release();
    }
}
}
export class ValidateDeleteActivitiesModel {
    static validateActivitiesModel =async(id)=>{
        const queryInscripcion = `select *from registrations where activityId = ?`;
        const [registros] = await pool.query(queryInscripcion,[id]);
        
        const queryDeleted = `select status,isDeleted from activities where id = ?`;
        const [rows] = await pool.query(queryDeleted,[id]);
        
        return {
            inscripcion:registros[0],
            status:rows[0].status,
            isDeleted:rows[0].isDeleted,
        };
    }

    static deleteActivitiesModel =async(id)=>{
        const query = `update activities 
        set isDeleted ='true'
        where id =?`
        await pool.query(query,[id]);
    }
}
