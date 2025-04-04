const express = require('express');
const finderRelate = require("./routes/finderRelate");
var cors = require('cors');
const logger = require('./helpers/logger');
const app = express();
app.use(cors());
app.use(express.json());
require('./globalVariable');
const port = global._port
// Import router

// Sử dụng router
app.use('/finderRelate', finderRelate);

// Định nghĩa một route đơn giản
app.get('/', (req, res) => {
    res.send('Hello, this is your API!');
});

// Khởi động server
app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});


