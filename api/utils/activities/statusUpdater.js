import {  pool  } from "../../config/db.js";

export const updateActivitiesStatus = async()=>{
    try {

        console.log('Actualizando estado de la actividad')

    const queryUpdateInprogress =`update activities 
    set status='inProgress'
    where status = 'pending' and
    startDate <= NOW()
    and isDeleted='false'`;
    const [inProgressResult] = await pool.query(queryUpdateInprogress);

    const queryUpdateFinished =`update activities
    set status='finished'
    where status In ('pending','inProgress') and endDate < NOW()
    and isDeleted='false'`;

    const [finishedResult] = await pool.query(queryUpdateFinished);
    
    console.log(` Estados actualizados: ${inProgressResult.affectedRows} a inProgress, ${finishedResult.affectedRows} a finished`);
    
    } catch (error) {
        console.log('Hubo un error al actualizar el estado',error)
    }
}

setInterval(updateActivitiesStatus,15*60*1000);

updateActivitiesStatus();