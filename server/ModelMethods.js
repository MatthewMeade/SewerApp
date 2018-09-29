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
  new models[model](_.extend(pickProps(model, props), { _creator: usrId }))
    .save()
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

models.getAll = (model, fields, usrId, callBack) => {
  console.log(fields);
  models[model]
    .find(
      { _creator: usrId },
      fields
        ? fields.split(",").reduce(
            (a, c) => {
              a[c] = 1;
              return a;
            },
            { _id: 1 }
          )
        : undefined
    )
    .then(doc => callBack(doc, null), e => callBack(null, e));
};

models.getAllFiltered = (model, props, userID, callBack) => {
  models[model]
    .find(_.extend(props, { _creator: userID }))
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
