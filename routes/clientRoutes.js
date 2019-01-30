const express = require("express");
const router = express.Router();

const clientController = require("../controllers/ClientController");

const { ensureIsAuth } = require("../handlers/auth");
const { catchErrors } = require("../handlers/errorHandlers");

router.use(ensureIsAuth);

// GET
// Renders client list
router.get("/", catchErrors(clientController.renderClientList));

// Renders a client detail page
router.get("/:id", catchErrors(clientController.renderClientView));

// Render the new client form with values pre filled
router.get("/:id/edit", catchErrors(clientController.renderEditClientForm));

// Render the new client form
router.get("/new", catchErrors(clientController.renderNewClientForm));

// POST
// Create a new Client
router.post("/new", catchErrors(clientController.createClient));

// Update a Client
router.post("/:id", catchErrors(clientController.updateClient));

// DELETE
// Delete a Client
router.delete("/:id", catchErrors(clientController.deleteClient));

module.exports = router;
