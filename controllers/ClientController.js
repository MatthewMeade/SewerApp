const mongoose = require("mongoose");
const Client = mongoose.model("Client");

exports.renderClientList = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = 25;
  const skip = Math.max(page * pageSize - pageSize, 0);

  const orderBy = req.query.orderBy || "created";
  const sortOrder = req.query.sortOrder || "desc";

  const search = req.query.search || "";

  const clientsPromise = Client.find({ author: req.user._id, $text: { $search: search } })
    .skip(skip)
    .limit(pageSize)
    .sort({ [orderBy]: sortOrder });

  const countPromise = Client.count({ author: req.user._id, $text: { $search: search } });

  const [clients, count] = await Promise.all([clientsPromise, countPromise]);

  const pages = Math.ceil(count / pageSize);
  if (!clients.length && skip) {
    req.flash("info", `Requested page ${page} doesn't exist. Redirected to page ${pages}`);

    req.query.page = pages;
    const params = [];
    for (const key in req.query) {
      params.push(`${key}=${req.query[key]}`);
    }

    if (!params.length) return res.render("/clients");

    return res.redirect(`/clients?${params.join("&")}`);
  }

  res.render("clientsList", { title: "Clients", clients, page, pages, count, orderBy, sortOrder, search });
};

exports.renderClientView = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next({ error: "That client does not exist", redirect: "/clients" });
  }

  const client = await Client.findOne({
    _id: req.params.id,
    author: req.user._id
  });

  if (!client) return next({ error: "That client does not exist", redirect: "/clients" });

  res.render("clientView", { title: `Client: ${client.firstName} ${client.lastName}` });
};

exports.renderNewClientForm = (req, res) => {
  res.render("editClient", { title: "New Client" });
};

exports.renderEditClientForm = async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    author: req.user._id
  });
  res.render("editClient", {
    title: `Edit Client ${client.firstName} ${client.lastName}`
  });
};

exports.createClient = async (req, res) => {
  req.body.author = req.user._id;
  const client = await new Client(req.body).save();
  req.flash("success", `Successfully created ${client.firstName} ${client.lastName}`);
  res.redirect(`/clients/${client.id}`);
};

exports.updateClient = async (req, res) => {
  const client = await Client.findOneAndUpdate(
    {
      _id: req.params.id,
      author: req.user._id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).exec();

  req.flash("success", `Successfully edited ${client.firstName} ${client.lastName}`);
  res.redirect(`/clients/${client.id}`);
};
