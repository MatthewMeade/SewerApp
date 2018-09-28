const { ObjectID } = require("mongodb");

const _ = require("lodash");

const models = global.models;
const schemas = global.schemas;
models.modelNames = Object.keys(schemas);

const pickProps = (model, props) => {
  return _.pick(
    props,
    Object.keys(metaData[model].fields).filter(k => k[0] !== "_")
  );
};

models.createNew = (model, props, usrId, callBack) => {
  console.log("creating new " + model);
  new models[model](_.extend(pickProps(model, props), { _creator: usrId }))
    .save()
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

models.getAll = (model, usrId, callBack) => {
  models[model]
    .find({ _creator: usrId })
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

models.getById = (model, id, usrId, callBack) => {
  models[model]
    .findOne({ _creator: usrId, _id: id })
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

models.updateById = (model, id, props, usrId, callBack) => {
  models[model]
    .findOneAndUpdate(
      { _creator: usrId, _id: id },
      { $set: pickProps(model, props) },
      { new: true }
    )
    .then(doc => callBack(doc, null), e => callBack(null));
};

models.deleteById = (model, id, usrId, callBack) => {
  models[model]
    .findOneAndRemove({ _creator: usrId, _id: id })
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

module.exports = models;
