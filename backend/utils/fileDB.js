/**
 * fileDB.js - JSON File Database Utility
 * Simulates database operations using local JSON files
 * Uses Node.js fs module for synchronous read/write operations
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

/**
 * Read all records from a JSON file
 * @param {string} filename - Name of the JSON file (without extension)
 * @returns {Array} Array of records
 */
const readDB = (filename) => {
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}.json:`, error.message);
    return [];
  }
};

/**
 * Write records to a JSON file (overwrites existing data)
 * @param {string} filename - Name of the JSON file (without extension)
 * @param {Array} data - Array of records to write
 * @returns {boolean} Success status
 */
const writeDB = (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}.json:`, error.message);
    return false;
  }
};

/**
 * Find a single record by field value
 * @param {string} filename - JSON file name
 * @param {string} field - Field to search by
 * @param {*} value - Value to match
 * @returns {Object|null} Found record or null
 */
const findOne = (filename, field, value) => {
  const records = readDB(filename);
  return records.find(record => record[field] === value) || null;
};

/**
 * Find all records matching a condition
 * @param {string} filename - JSON file name
 * @param {Function} predicate - Filter function
 * @returns {Array} Matching records
 */
const findMany = (filename, predicate) => {
  const records = readDB(filename);
  return predicate ? records.filter(predicate) : records;
};

/**
 * Insert a new record into the JSON file
 * @param {string} filename - JSON file name
 * @param {Object} record - Record to insert
 * @returns {Object} Inserted record
 */
const insertOne = (filename, record) => {
  const records = readDB(filename);
  records.push(record);
  writeDB(filename, records);
  return record;
};

/**
 * Update a record by ID
 * @param {string} filename - JSON file name
 * @param {string} id - Record ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated record or null
 */
const updateOne = (filename, id, updates) => {
  const records = readDB(filename);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  records[index] = { ...records[index], ...updates, updatedAt: new Date().toISOString() };
  writeDB(filename, records);
  return records[index];
};

/**
 * Delete a record by ID
 * @param {string} filename - JSON file name
 * @param {string} id - Record ID to delete
 * @returns {boolean} Success status
 */
const deleteOne = (filename, id) => {
  const records = readDB(filename);
  const filtered = records.filter(r => r.id !== id);
  if (filtered.length === records.length) return false; // Not found
  writeDB(filename, filtered);
  return true;
};

module.exports = { readDB, writeDB, findOne, findMany, insertOne, updateOne, deleteOne };
