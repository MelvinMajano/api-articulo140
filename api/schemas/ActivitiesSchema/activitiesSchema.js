import zod from "zod"

const activitiesSchema = zod.object({
    "titulo":zod.string(),
    "descripcion":zod.string().min(5).max(500),
    "fecha_inicio":zod.string(),
    "fecha_fin":zod.string(),
    "horasVoae":zod.number(),
    "cuposDisponibles":zod.number(),
    "supervisorId":zod.uuidv4(),
    "ambitoId":zod.array(zod.enum(["1","2","3","4"])).min(1),
}).strict();

export const validateActividad = async(data)=>{
    return activitiesSchema.safeParse(data);
}

const activitiesSchemaput = zod.object({
    "actividadId":zod.uuidv4(),
    "titulo":zod.string(),
    "descripcion":zod.string().min(5).max(500),
    "fecha_inicio":zod.string(),
    "fecha_fin":zod.string(),
    "horasVoae":zod.number(),
    "cuposDisponibles":zod.number(),
    "supervisorId":zod.uuidv4(),
    "ambitoId":zod.array(zod.enum(["1","2","3","4"])).min(1),
}).strict();

export const validateActividadput = async(data)=>{
    return activitiesSchemaput.safeParse(data);
}