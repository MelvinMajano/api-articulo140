import { pool } from "../../config/db.js";


export const degreeExistsModel = async (id) => {

    const cnn = await pool.getConnection();
    const query = "select * from degrees where id = ?";

    const [rows] = await cnn.execute(query, [id]);

    return rows
}

export const hasConflictDegreeModel = async (id) => {

    const cnn = await pool.getConnection();
    const query = "select * from activities where degreeId = ?";

    const [rows] = await cnn.execute(query, [id]);

    return rows
}

export const createDegreeModel = async (degree) => {

    const cnn = await pool.getConnection();
    const { code, name, faculty } = degree;

    const query = "insert into degrees (code, name, faculty) values (?,?,?)";

    try {
        await cnn.execute(query, [code, name, faculty]);   
    } catch (error) {
        throw error
    }
}

export const getDegreesModel = async () => {
    const cnn = await pool.getConnection();
    const query = "select * from degrees";

    try {

        const [rows] = await cnn.execute(query);
        return rows;

    } catch (error) {
        throw error;
    }
}

export const updateDegreeModel = async (degree,id) => {

    const cnn = await pool.getConnection();
    const { code, name, faculty } = degree;
    const query = "update degrees set code = ?, name = ?, faculty = ? where id = ?";

    try {
        await cnn.execute(query, [code, name, faculty, id]);
    } catch (error) {
        throw error;
    }
}

export const deleteDegreeModel = async (id) => {

    const cnn = await pool.getConnection();

    const query = "update degrees set isDisabled = 1 where id = ?";

    try {
        await cnn.execute(query, [id]);
    } catch (error) {
        throw error;
    }
}

export const restoreDegreeModel = async (id) => {
    const cnn = await pool.getConnection();

    const query = "update degrees set isDisabled = 2 where id = ?";
    try {
        await cnn.execute(query, [id]);
    } catch (error) {
        throw error;
    }
}