const { authenticate } = require("../middleware/authenticate.js");
const yaml = require("js-yaml");
const fs = require("fs");
const resolve = require("path").resolve;

const Models = require("../ModelMethods.js");

module.exports = app => {
  Models.modelNames.forEach(name => {
    // Get All
    app.get(`/${name}s`, authenticate, (req, res) => {
      Models.getAll(name, req.query.fields, req.user._id, (doc, e) => {
        res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
      });
    });

    // Get By ID
    app.get(`/${name}s/:id`, authenticate, (req, res) => {
      Models.getById(name, req.params.id, req.user._id, (doc, e) => {
        res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
      });
    });

    // Post
    app.post(`/${name}s`, authenticate, (req, res) => {
      Models.createNew(name, req.body, req.user._id, (doc, e) => {
        res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
      });
    });

    // Patch
    app.patch(`/${name}s/:id`, authenticate, (req, res) => {
      Models.updateById(
        name,
        req.params.id,
        req.body,
        req.user._id,
        (doc, e) => {
          res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
        }
      );
    });

    // Delete
    app.delete(`/${name}s/:id`, authenticate, (req, res) => {
      Models.deleteById(name, req.params.id, req.user._id, (doc, e) => {
        res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
      });
    });

    // Get Metadata
    app.get(`/metadata/${name}s`, authenticate, (req, res) => {
      res.send(global.metaData[name]);
    });
  });
};
