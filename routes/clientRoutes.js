const express = require("express");
const router = express.Router();

const clientController = require("../controllers/ClientController");

const { ensureIsAuth } = require("../handlers/auth");
const { catchErrors } = require("../handlers/errorHandlers");

router.use(ensureIsAuth);

// GET
// Renders client list
router.get("/", catchErrors(clientController.renderClientList));

// Render the new client form
router.get("/new", clientController.renderNewClientForm);

// Renders a client detail page
router.get("/:id", catchErrors(clientController.renderClientView));

// Render the new client form with values pre filled
router.get("/:id/edit", catchErrors(clientController.renderEditClientForm));

// POST
// Create a new Client
router.post("/new", catchErrors(clientController.createClient));

// Update a Client
router.post("/:id", catchErrors(clientController.updateClient));

// Delete a Client
router.post("/:id/delete", catchErrors(clientController.deleteClient));

module.exports = router;
