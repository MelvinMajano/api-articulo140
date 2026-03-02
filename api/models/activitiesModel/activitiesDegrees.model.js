import { pool } from "../../config/db.js";


export const degreeExistsModel = async (id) => {
    const query = "select * from degrees where id = ?";
    const [rows] = await pool.execute(query, [id]);
    return rows
}

export const hasConflictDegreeModel = async (id) => {
    const query = "select * from activities where degreeId = ?";
    const [rows] = await pool.execute(query, [id]);
    return rows
}

export const createDegreeModel = async (degree) => {
    const { code, name, faculty } = degree;
    const query = "insert into degrees (code, name, faculty) values (?,?,?)";
    await pool.execute(query, [code, name, faculty]);
}

export const getDegreesModel = async (options) => {
    
    const {validateLimit, offset} = options;

    const query = `select * from degrees limit ? offset ?`;
    const [rows] = await pool.query(query, [validateLimit,offset]);
    return rows;
}

export const getTotalDegreesModel = async () => {
    const query = `select count(*) as total from degrees`;
    const [result] = await pool.query(query);
    return result;
}

export const updateDegreeModel = async (degree, id) => {
    const { code, name, faculty } = degree;
    const query = "update degrees set code = ?, name = ?, faculty = ? where id = ?";
    await pool.execute(query, [code, name, faculty, id]);
}

export const deleteDegreeModel = async (id) => {
    const query = "update degrees set isDisabled = 1 where id = ?";
    await pool.execute(query, [id]);
}

export const restoreDegreeModel = async (id) => {
    const query = "update degrees set isDisabled = 2 where id = ?";
    await pool.execute(query, [id]);
}