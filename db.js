
const sql = require('mssql');
const fs = require('fs');
const logger = require('./helpers/logger');

// Đọc nội dung từ file config.json
const rawdata = fs.readFileSync('./config/db_config.json');
const config = JSON.parse(rawdata);
// const config = {
//     user: 'utest6',
//     password: '2015passpass@',
//     server: '192.168.1.250',
//     port: 1588,
//     database: 'User',
//     options: {
//         encrypt: false,
//         trustServerCertificate: true,
//     },
// };

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        logger.info("Connected to SQL Server");

        return pool;
    })
    .catch((err) => {
        logger.error(`Error connecting to SQL Server: ${err}`);
    });

module.exports = {
    sql,
    poolPromise,
};
