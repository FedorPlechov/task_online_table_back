const express = require("express");

const tableController = require("../controllers/table");

const router = express.Router();

router.get('/table', tableController.getTable);

module.exports = router;
