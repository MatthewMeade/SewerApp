const mongoose = require("mongoose");
const multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");

const Contractor = mongoose.model("Contractor");
const Inspector = mongoose.model("Inspector");
const Spec = mongoose.model("Spec");

const types = { contractor: Contractor, inspector: Inspector, spec: Spec };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./uploads/${req.user._id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    const fileName = `${Date.now()}.${extension}`;

    console.log("HERE:");
    console.log(req.user);
    req.body.file = fileName;
    cb(null, fileName);
  }
});

exports.upload = multer({ storage }).any();

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
