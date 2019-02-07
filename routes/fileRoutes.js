const express = require("express");
const router = express.Router();

const FileController = require("../controllers/FileController");
const { ensureIsAuth } = require("../handlers/auth");

router.get("/uploads/:fileName", ensureIsAuth, FileController.getUpload);

module.exports = router;
