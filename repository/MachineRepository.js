// repository/MachineRepository.js
var { QueryTypes } = require('sequelize');
const db = require('../config/connection'); // Koneksi database
const { Machines } = require("../models/Machine"); // Model mesin

const getAllMachines = async () => {
    try {
        const machines = await db.query(
            'SELECT * FROM `machines`',
            {
                type: QueryTypes.SELECT,
                model: Machines,
                mapToModel: true,
            }
        );

        console.log('Machines:', machines);
        return machines;
    } catch (error) {
        console.error('Error fetching machines:', error);
        throw error;
    }
}

const getMachineById = async (id) => {
    try {
        const machine = await db.query(
            'SELECT * FROM machines WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.SELECT,
                model: Machines,
                mapToModel: true,
                plain: true
            }
        );
        return machine;
    } catch (error) {
        console.error('Error fetching machine by ID:', error);
        throw error;
    }
};

const createMachine = async (machineData) => {
    try {
        const result = await db.query(
            'INSERT INTO machines (machine_number, machine_name, location, carline, createdAt, updatedAt) VALUES (:machine_number, :machine_name, :location, :carline, NOW(), NOW())',
            {
                replacements: machineData,
                type: QueryTypes.INSERT
            }
        );
        return machineData;
    } catch (error) {
        console.error('Error creating machine:', error);
        throw error;
    }
};

const updateMachine = async (id, machineData) => {
    try {
        const result = await db.query(
            'UPDATE machines SET machine_number = :machine_number, machine_name = :machine_name, location = :location, carline = :carline, updatedAt = NOW() WHERE id = :id',
            {
                replacements: { ...machineData, id },
                type: QueryTypes.UPDATE
            }
        );
        return result[1];
    } catch (error) {
        console.error('Error updating machine:', error);
        throw error;
    }
};

const deleteMachine = async (id) => {
    try {
        const result = await db.query(
            'DELETE FROM machines WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.DELETE
            }
        );
        return result;
    } catch (error) {
        console.error('Error deleting machine:', error);
        throw error;
    }
};

const searchMachines = async (searchTerm) => {
    try {
        const machines = await db.query(
            'SELECT * FROM machines WHERE machine_number LIKE :search OR machine_name LIKE :search OR location LIKE :search OR carline LIKE :search',
            {
                replacements: { search: `%${searchTerm}%` },
                type: QueryTypes.SELECT,
                model: Machines,
                mapToModel: true
            }
        );
        return machines;
    } catch (error) {
        console.error('Error searching machines:', error);
        throw error;
    }
};

const filterMachines = async (filters) => {
    try {
        let query = 'SELECT * FROM machines WHERE 1=1';
        const replacements = {};

        if (filters.carline) {
            query += ' AND carline LIKE :carline';
            replacements.carline = `%${filters.carline}%`;
        }

        if (filters.location) {
            query += ' AND location LIKE :location';
            replacements.location = `%${filters.location}%`;
        }

        // Add sorting if specified
        if (filters.sortBy) {
            query += ` ORDER BY ${filters.sortBy} ${filters.sortOrder || 'ASC'}`;
        }

        const machines = await db.query(query, {
            replacements,
            type: QueryTypes.SELECT,
            model: Machines,
            mapToModel: true
        });

        return machines;
    } catch (error) {
        console.error('Error filtering machines:', error);
        throw error;
    }
};

const bulkCreateMachine = async (machines) => {
    try {
        if (!Array.isArray(machines) || machines.length === 0) return [];
        const values = machines.map(machine => [
            machine.machine_number,
            machine.machine_name,
            machine.location || null,
            machine.carline || null,
            new Date(),
            new Date()
        ]);
        const result = await db.query(
            'INSERT INTO machines (machine_number, machine_name, location, carline, createdAt, updatedAt) VALUES ?',
            {
                replacements: [values],
                type: QueryTypes.INSERT
            }
        );
        return machines;
    } catch (error) {
        console.error('Error bulk creating machines:', error);
        throw error;
    }
};
module.exports = {
    getAllMachines,
    getMachineById,
    createMachine,
    updateMachine,
    deleteMachine,
    searchMachines,
    filterMachines,
    bulkCreateMachine
};