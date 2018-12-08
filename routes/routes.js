const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const apiController = require('../controllers/apiController');
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

router.post(
    '/add/system/',
    systemController.upload,
    catchErrors(systemController.createSystem),
);

router.post(
    '/add/system/:id',
    systemController.upload,
    catchErrors(systemController.update),
);

router.get('/api/staticmap', catchErrors(apiController.mapImage));
module.exports = router;
