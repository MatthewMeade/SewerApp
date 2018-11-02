const express = require('express');
const router = express.Router();
// const storeController = require('../controllers/storeController');
// const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => res.render('index.pug', { title: 'Home' }));
router.get('/home', (req, res) => res.render('index.pug', { title: 'Home' }));

router.get('/systems', (req, res) =>
  res.render('systems.pug', { title: 'Systems' }),
);
router.get('/clients', (req, res) =>
  res.render('clients.pug', { title: 'Clients' }),
);
router.get('/invoices', (req, res) =>
  res.render('invoices.pug', { title: 'Invoices' }),
);
router.get('/settings', (req, res) =>
  res.render('settings.pug', { title: 'Settings' }),
);

module.exports = router;
