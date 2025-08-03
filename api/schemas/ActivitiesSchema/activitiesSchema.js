import zod from "zod"

const activitiesSchema = zod.object({
    "title":zod.string(),
    "description":zod.string().min(5).max(500),
    "startDate":zod.coerce.date(),
    "endDate":zod.coerce.date(),
    "voaeHours":zod.number(),
    "availableSpots":zod.number(),
    "supervisorId":zod.uuidv4(),
    "scopes":zod.array(zod.enum(["1","2","3","4"])).min(1),
}).strict();

export const validateActividad = async(data)=>{
    return activitiesSchema.safeParse(data);
}

const activitiesSchemaput = zod.object({
    "actividadId":zod.uuidv4(),
    "title":zod.string(),
    "description":zod.string().min(5).max(500),
    "startDate":zod.coerce.date(),
    "endDate":zod.coerce.date(),
    "voaeHours":zod.number(),
    "availableSpots":zod.number(),
    "supervisorId":zod.uuidv4(),
    "scopes":zod.array(zod.enum(["1","2","3","4"])).min(1),
    "isDisable": zod.number().int(),
}).strict();

export const validateActividadput = async(data)=>{
    return activitiesSchemaput.safeParse(data);
}