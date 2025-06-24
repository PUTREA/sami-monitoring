var { QueryTypes } = require('sequelize');
const db = require('../config/connection');

const getAllProblems = async () => {
    try {
        const problems = await db.query(
            'SELECT * FROM `problems`',
            {
                type: QueryTypes.SELECT,
                mapToModel: true,
            }
        );
        return problems;
    } catch (error) {
        throw error;
    }
};

const getProblemById = async (id) => {
    try {
        const problem = await db.query(
            'SELECT * FROM problems WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.SELECT,
                plain: true
            }
        );
        return problem;
    } catch (error) {
        throw error;
    }
};

const createProblem = async (problemData) => {
    try {
        const result = await db.query(
            'INSERT INTO problems (no, problem, createdAt, updatedAt) VALUES (:no, :problem, :createdAt, :updatedAt)',
            {
                replacements: {
                    no: problemData.no,
                    problem: problemData.problem,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                type: QueryTypes.INSERT
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
};

const updateProblem = async (id, problemData) => {
    try {
        const result = await db.query(
            'UPDATE problems SET no = :no, problem = :problem WHERE id = :id',
            {
                replacements: { ...problemData, id },
                type: QueryTypes.UPDATE
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteProblem = async (id) => {
    try {
        const result = await db.query(
            'DELETE FROM problems WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.DELETE
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllProblems,
    getProblemById,
    createProblem,
    updateProblem,
    deleteProblem
};