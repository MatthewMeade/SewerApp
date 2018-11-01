const express = require('express');
const router = express.Router();
// const storeController = require('../controllers/storeController');
// const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => res.render('index.pug'));
router.get('/home', (req, res) => res.render('index.pug'));

router.get('/systems', (req, res) => res.render('systems.pug'));
router.get('/clients', (req, res) => res.render('clients.pug'));
router.get('/invoices', (req, res) => res.render('invoices.pug'));
router.get('/settings', (req, res) => res.render('settings.pug'));

module.exports = router;
