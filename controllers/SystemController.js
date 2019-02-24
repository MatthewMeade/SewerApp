const mongoose = require("mongoose");
const System = mongoose.model("System");

const Clients = mongoose.model("Client");
const Contractor = mongoose.model("Contractor");
const Inspector = mongoose.model("Inspector");
const Spec = mongoose.model("Spec");

// Lot's of duplicated code from System Controller
// TODO: Refactor

exports.renderSystemList = async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const pageSize = 25;
  const skip = Math.max(page * pageSize - pageSize, 0);

  const orderBy = req.query.orderBy || "created";
  const sortOrder = req.query.sortOrder || "desc";

  const search = req.query.search || "";

  const findObj = { author: req.user._id };
  if (search) findObj.$text = { $search: search };

  const systemsPromise = System.find(findObj)
    .skip(skip)
    .limit(pageSize)
    .sort({ [orderBy]: sortOrder });

  const countPromise = System.count(findObj);

  const [systems, count] = await Promise.all([systemsPromise, countPromise]);

  const pages = Math.ceil(count / pageSize);
  if ((!systems.length && skip) || page < 1) {
    req.flash("info", `Requested page ${page} doesn't exist. Redirected to page ${pages}`);

    req.query.page = pages;
    const params = [];
    for (const key in req.query) {
      params.push(`${key}=${req.query[key]}`);
    }

    return res.redirect(`/systems?${params.join("&")}`);
  }

  res.render("systemViews/systemsList", { title: "Systems", systems, page, pages, count, orderBy, sortOrder, search });
};

exports.renderSystemView = async (req, res, next) => {
  const system = await System.findOne({
    _id: req.params.id,
    author: req.user._id,
  });

  if (!system) return next({ error: "That system does not exist", redirect: "/systems" });

  res.render("systemViews/systemView", { title: ` ${system.id}`, system });
};

exports.renderNewSystemForm = async (req, res) => {
  const system = req.session.body || {};
  req.session.body = null;

  const author = req.user.id;
  const [clients, contractors, inspectors, specs] = await Promise.all([
    Clients.find({ author }),
    Contractor.find({ author }),
    Inspector.find({ author }),
    Spec.find({ author }),
  ]);

  res.render("systemViews/editSystem", {
    title: "New System",
    system,
    isNew: true,
    clients,
    contractors,
    inspectors,
    specs,
  });
};

exports.renderEditSystemForm = async (req, res) => {
  const system =
    req.session.body ||
    (await System.findOne({
      slug: req.params.id,
      author: req.user._id,
    }));
  req.session.body = null;

  if (!system) return next({ error: "That system does not exist", redirect: "/systems" });

  res.render("systemViews/editSystem", {
    title: `${system.firstName} ${system.lastName}`,
    system,
    isNew: false,
  });
};

exports.createSystem = async (req, res) => {
  req.body.author = req.user._id;
  const system = await new System(req.body).save();
  req.flash("success", `Successfully created System ${system.id}}`);
  res.redirect(`/systems/${system.id}`);
};

exports.updateSystem = async (req, res) => {
  const system = await System.findOneAndUpdate(
    {
      slug: req.params.id,
      author: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).exec();

  if (!system) return next({ error: "That system does not exist", redirect: "/systems" });

  req.flash("success", `Successfully edited ${system.firstName} ${system.lastName}`);
  res.redirect(`/systems/${system.id}`);
};

exports.deleteSystem = async (req, res) => {
  const system = await System.findOneAndRemove({
    slug: req.params.id,
    author: req.user._id,
  }).exec();

  if (!system) return next({ error: "That system does not exist", redirect: "/systems" });

  req.flash("success", `Successfully deleted ${system.firstName} ${system.lastName}`);
  res.redirect(`/systems`);
};
