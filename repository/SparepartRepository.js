var { QueryTypes } = require('sequelize');
const db = require('../config/connection');
const { Sparepart } = require("../models/Sparepart");

const getAllSpareparts = async () => {
    try {
        const spareparts = await db.query(
            'SELECT * FROM `spareparts`',
            {
                type: QueryTypes.SELECT,
                model: Sparepart,
                mapToModel: true,
            }
        );
        return spareparts;
    } catch (error) {
        throw error;
    }
};

const getSparepartById = async (id) => {
    try {
        const sparepart = await db.query(
            'SELECT * FROM spareparts WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.SELECT,
                model: Sparepart,
                mapToModel: true,
                plain: true
            }
        );
        return sparepart;
    } catch (error) {
        throw error;
    }
};

const createSparepart = async (sparepartData) => {
    try {
        await db.query(
            'INSERT INTO spareparts (location, part_name, part_number, part_sami_number, category, machine_spec, machine_name, createdAt, updatedAt) VALUES (:location, :part_name, :part_number, :part_sami_number, :category, :machine_spec, :machine_name, NOW(), NOW())',
            {
                replacements: sparepartData,
                type: QueryTypes.INSERT
            }
        );
        return sparepartData;
    } catch (error) {
        throw error;
    }
};

const updateSparepart = async (id, sparepartData) => {
    try {
        await db.query(
            'UPDATE spareparts SET location = :location, part_name = :part_name, part_number = :part_number, part_sami_number = :part_sami_number, category = :category, machine_spec = :machine_spec, machine_name = :machine_name, updatedAt = NOW() WHERE id = :id',
            {
                replacements: { ...sparepartData, id },
                type: QueryTypes.UPDATE
            }
        );
        return { id, ...sparepartData };
    } catch (error) {
        throw error;
    }
};

const deleteSparepart = async (id) => {
    try {
        await db.query(
            'DELETE FROM spareparts WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.DELETE
            }
        );
        return true;
    } catch (error) {
        throw error;
    }
};

const bulkCreateSpareparts = async (sparepartsData) => {
    try {
        await db.query(
            'INSERT INTO spareparts (location, part_name, part_number, part_sami_number, category, machine_spec, machine_name, createdAt, updatedAt) VALUES ?',
            {
                replacements: [sparepartsData.map(sparepart => [
                    sparepart.location, 
                    sparepart.part_name,
                    sparepart.part_number,
                    sparepart.part_sami_number,
                    sparepart.category,
                    sparepart.machine_spec,
                    sparepart.machine_name,
                    new Date(),
                    new Date()
                ])] ,
                type: QueryTypes.INSERT
            } 
        ) ;
    } catch (error) {
        throw error;
    }
};

const searchSpareparts = async (searchTerm) => {
    try {
        const spareparts = await db.query(
            'SELECT * FROM spareparts WHERE location LIKE :search OR part_name LIKE :search OR part_number LIKE :search OR part_sami_number LIKE :search OR category LIKE :search OR machine_spec LIKE :search OR machine_name LIKE :search',
            {
                replacements: { search: `%${searchTerm}%` },
                type: QueryTypes.SELECT,
                model: Sparepart,
                mapToModel: true
            }
        );
        return spareparts;
    } catch (error) {
        console.error('Error searching spareparts:', error);
        throw error;
    }
};

const filterSpareparts = async (filters) => {
    try {
        let query = 'SELECT * FROM spareparts WHERE 1=1';
        const replacements = {};

        if (filters.location) {
            query += ' AND location LIKE :location';
            replacements.location = `%${filters.location}%`;
        }

        if (filters.category) {
            query += ' AND category LIKE :category';
            replacements.category = `%${filters.category}%`;
        }

        if (filters.machine_name) {
            query += ' AND machine_name LIKE :machine_name';
            replacements.machine_name = `%${filters.machine_name}%`;
        }

        if (filters.machine_spec) {
            query += ' AND machine_spec LIKE :machine_spec';
            replacements.machine_spec = `%${filters.machine_spec}%`;
        }

        if (filters.part_name) {
            query += ' AND part_name LIKE :part_name';
            replacements.part_name = `%${filters.part_name}%`;
        }

        if (filters.part_number) {
            query += ' AND part_number LIKE :part_number';
            replacements.part_number = `%${filters.part_number}%`;
        }

        if (filters.part_sami_number) {
            query += ' AND part_sami_number LIKE :part_sami_number';
            replacements.part_sami_number = `%${filters.part_sami_number}%`;
        }

        // Add sorting if specified
        if (filters.sortBy) {
            query += ` ORDER BY ${filters.sortBy} ${filters.sortOrder || 'ASC'}`;
        }

        const spareparts = await db.query(query, {
            replacements,
            type: QueryTypes.SELECT,
            model: Sparepart,
            mapToModel: true
        });

        return spareparts;
    } catch (error) {
        console.error('Error filtering spareparts:', error);
        throw error;
    }
};

module.exports = {
    getAllSpareparts,
    getSparepartById,
    createSparepart,
    updateSparepart,
    deleteSparepart,
    bulkCreateSpareparts,
    searchSpareparts,
    filterSpareparts
};