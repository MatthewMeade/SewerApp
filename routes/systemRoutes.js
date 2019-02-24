const express = require("express");
const router = express.Router();

const systemController = require("../controllers/SystemController");
const UploadController = require("../controllers/FileController");

const { ensureIsAuth } = require("../handlers/auth");
const { catchErrors } = require("../handlers/errorHandlers");

router.use(ensureIsAuth);

// GET
// Render system list
router.get("/", catchErrors(systemController.renderSystemList));

// Render new system form
router.get("/new", catchErrors(systemController.renderNewSystemForm));

// Render client detail page
router.get("/:id", catchErrors(systemController.renderSystemView));

// Render edit client form
router.get("/:id/edit", catchErrors(systemController.renderEditSystemForm));

// POST
// Create a new system
router.post("/new", UploadController.upload, catchErrors(systemController.createSystem));

// Update a system
router.post("/:id", UploadController.upload, catchErrors(systemController.updateSystem));

// Delete a system
router.post("/:id/delete", catchErrors(systemController.deleteSystem));

module.exports = router;
