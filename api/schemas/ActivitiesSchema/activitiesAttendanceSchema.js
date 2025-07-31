import zod from "zod"

const activitiesAttendanceSchema = zod.object({
    "hora_entrada": zod.string(),
    "hora_salida": zod.string()
}).strict();

export const validateAttendance = async (data) => {
    return activitiesAttendanceSchema.safeParse(data);
}

