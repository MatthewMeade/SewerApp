const { ObjectID } = require("mongodb");

const { mongoose } = require("./db/mongoose.js");
const _ = require("lodash");

const Models = require("./models/DataModels.js");
Models.modelNames = Object.keys(Models);

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
