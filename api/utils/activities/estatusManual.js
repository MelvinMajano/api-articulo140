import { pool } from '../../config/db.js';

export const deshabilitarActividad = async (isDisable, actividadId, connection = null) => {
    const conn = connection || pool;
    if (isDisable !== 1) {
        return; 
    }
    
    const queryDeshabilitar = `update activities SET status='disabled' WHERE id=? AND isDeleted='false'`;
    await conn.execute(queryDeshabilitar, [actividadId]);
};

export const habilitarActividad = async (isDisable, actividadId, connection = null) => {
    if (isDisable !== 0) { 
        return; 
    }
    await calcularStatusPorFechas(actividadId, connection);
};

export const calcularStatusPorFechas = async (actividadId, connection = null) => {
    const conn = connection || pool;
    const queryFechas = `select startDate, endDate from activities WHERE id=? AND isDeleted='false'`;
    const [rows] = await conn.execute(queryFechas, [actividadId]);
    
    if (rows.length === 0) return;
    
    const { startDate } = rows[0];
    const ahora = new Date();
    let nuevoStatus;
    if (ahora < new Date(startDate)) {
        nuevoStatus = 'pending';
    } else {
        nuevoStatus = 'inProgress';
    } 

    const queryUpdate = `update activities SET status=? where id=?`;
    
    await conn.execute(queryUpdate, [nuevoStatus, actividadId]);
};