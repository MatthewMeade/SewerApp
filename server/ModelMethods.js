const { ObjectID } = require("mongodb");

const { mongoose } = require("./db/mongoose.js");
const _ = require("lodash");

const Models = {};

Models.System = require("./models/system.js").System;
Models.Client = require("./models/client.js").Client;
Models.User = require("./models/user.js").User;
Models.Upload = require("./models/upload.js").Upload;
Models.Contractor = require("./models/contractor.js").Contractor;
Models.Inspector = require("./models/inspector.js").Inspector;
Models.Spec = require("./models/spec.js").Spec;

const pickProps = (model, props) => {
  return _.pick(
    props,
    Object.keys(mongoose.model(model).schema.obj).filter(k => k[0] !== "_")
  );
};

Models.createNew = (model, props, usrId, callBack) => {
  new Models[model](_.extend(pickProps(model, props), { _creator: usrId }))
    .save()
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

Models.getAll = (model, usrId, callBack) => {
  Models[model]
    .find({ _creator: usrId })
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

Models.getById = (model, id, usrId, callBack) => {
  Models[model]
    .findOne({ _creator: usrId, _id: id })
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

Models.updateById = (model, id, props, usrId, callBack) => {
  Models[model]
    .findOneAndUpdate(
      { _creator: usrId, _id: id },
      { $set: pickProps(model, props) },
      { new: true }
    )
    .then(doc => callBack(doc, null), e => callBack(null));
};

Models.deleteById = (model, id, usrId, callBack) => {
  Models[model]
    .findOneAndRemove({ _creator: usrId, _id: id })
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

module.exports = Models;
