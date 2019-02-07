const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const Contractor = mongoose.model("Contractor");
const Inspector = mongoose.model("Inspector");
const Spec = mongoose.model("Spec");

const types = { contractor: Contractor, inspector: Inspector, spec: Spec };

exports.renderSettingsPage = async (req, res) => {
  const promises = [
    Contractor.find({ author: req.user._id }).exec(),
    Inspector.find({ author: req.user._id }).exec(),
    Spec.find({ author: req.user._id }).exec()
  ];

  const [contractors, inspectors, specs] = await Promise.all(promises);

  res.render("settings", { title: "Settings", contractors, inspectors, specs });
};

exports.addTypeOption = async (req, res) => {
  const Type = types[req.params.type];

  req.body.author = req.user._id;
  const doc = await new Type(req.body).save();
  req.flash("success", `Successfully created ${doc.name}`);
  res.redirect("/settings");
};

exports.deleteTypeOption = async (req, res, next) => {
  const Type = types[req.params.type];

  const doc = await Type.findOneAndRemove({
    _id: req.params.id,
    author: req.user._id
  }).exec();

  if (!doc) return next({ error: `That ${req.params.type} does not exist`, redirect: "/settings" });

  req.flash("success", `Successfully deleted ${doc.name}`);
  res.redirect("/settings");
};
