const mongoose = require('mongoose');
const System = mongoose.model('system');

const multer = require('multer');

// Page Renders
exports.getSystems = async (req, res) => {
    const page = req.params.page || 1;
    const limit = req.params.limit || 25;
    const skip = page * limit - limit;
    const sortBy = req.params.sortBy || 'created';
    const sortOrder = req.params.sortOrder || 'desc';

    const systemsPromise = System.find()
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder });

    const [systems, count] = Promise.all(systemsPromise, System.count());
    const pages = Math.ceil(count / limit);

    if (!systems.length) {
        req.flash(
            'info',
            `Requested page ${page} does not exist, redirected back to home`,
        );
        res.redirect('/home');
        return;
    }

    res.render('/systems', { title: 'Systems', systems, page, pages, count });
};

// API Updates
exports.createSystem = async (req, res) => {
    const system = await new System(req.body).save();
    req.flash('success', `Sucessfully Created System`);
    res.redirect('/systems');
};

exports.updateSystem = async (req, res) => {
    req.body.location.type = 'Point';

    const system = await Store.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
            new: true, // return the new store instead of the old one
            runValidators: true,
        },
    ).exec();

    req.flash('success', `Successfully Updated System`);
    res.redirect(`/systems/:id`);
};

const fileFields = [
    { name: 'sitePhotos' },
    { name: 'mapPhotos' },
    { name: 'floorPlans' },
];

exports.upload = multer({ dest: 'uploads/' }).fields(fileFields);
