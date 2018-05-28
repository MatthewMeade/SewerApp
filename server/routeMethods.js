// TODO
// Return response to be sent rather than sending here

const { ObjectID } = require("mongodb");

var getAll = (req, res, model) => {
  model
    .find({
      _creator: req.user._id
    })
    .then(
      doc => {
        res.send({ doc });
      },
      e => {
        res.status(400).send(e);
      }
    );
};

var getById = (req, res, model) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  model
    .findOne({
      _id: id,
      _creator: req.user._id
    })
    .then(doc => {
      if (!doc) {
        return res.status(404).send();
      }
      res.send({ doc });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

var postWithProps = (req, res, model, props) => {
  var newItem = new model(
    Object.assign(
      {
        _creator: req.user._id
      },
      props
    )
  );

  newItem.save().then(
    doc => {
      res.send({ doc });
    },
    e => {
      res.status(400).send(e);
    }
  );
};

var patchProps = (req, res, model, body) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  model
    .findOneAndUpdate(
      {
        _id: id,
        _creator: req.user._id
      },
      {
        $set: body
      },
      { new: true }
    )
    .then(doc => {
      if (!doc) {
        return res.status(400).send();
      }

      res.send({ doc });
    })
    .catch(e => res.status(400).send(e));
};

var deleteById = (req, res, model) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  model
    .findOneAndRemove({
      _id: id,
      _creator: req.user._id
    })
    .then(doc => {
      if (!doc) {
        return res.status(404).send();
      }

      res.send({ doc });
    })
    .catch(e => res.status(400).send(e));
};

module.exports = { getAll, getById, postWithProps, patchProps, deleteById };
