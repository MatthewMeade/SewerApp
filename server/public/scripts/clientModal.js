$.widget("app.clientModal", {
  _init: function() {
    this.options = {
      keyValueLabels: {
        firstName: "First Name",
        lastName: "Last Name",
        title: "Title",
        email: "Email",
        homePhone: "Home Phone",
        mobilePhone: "Mobile Phone",
        streetAddress: "Street Address",
        city: "City",
        province: "Province",
        postCode: "Postal Code"
      }
    };
    $("#clientModal").modal({
      show: false,
      backdrop: "static",
      keyboard: false
    });

    this.title = $(this.element).find(".modal-title");
    this.body = $(this.element).find(".modal-body");
    this.footer = $(this.element).find(".modal-body");
    this.infoBody = $(this.element).find(".clientInfo");
    this.editForm = $(this.element).find(".clientFormContainer");
    this.editButton = $(this.element).find(".editBtn");
    this.saveBtn = $(this.element).find(".saveBtn");

    this.editForm.fadeOut();
    this.saveBtn.fadeOut();

    $(this.element)
      .find(".close, .closeBtn")
      .click(this.close.bind(this));

    this.editButton.click(this.openEdit.bind(this));
    this.saveBtn.click(this.saveEdit.bind(this));
  },

  open: function(id, newClient) {
    this.id = id;
    this.loadData(id);

    if (newClient) {
      this.openEdit();
    }

    $("#clientModal").modal("show");
  },

  close: function() {
    this.data = {};
    this.closeEdit();
    $("#clientModal").modal("hide");
  },

  loadData: function() {
    $.ajax({
      url: "/clients/" + this.id,
      success: res => {
        this.data = res.client;
      },
      async: false
    });

    this.infoBody.find(".clientInfoPair").remove();
    for (key in this.options.keyValueLabels) {
      this.infoBody.append(`
          <div class='clientInfoPair col-lg-4 col-md-6'>
            <label>${
              this.options.keyValueLabels[key]
            }: </label> <span id='client${key}'>${this.data[key]}</span>
          </div>`);
    }

    for (key in this.data) {
      $(this.element)
        .find(`[name=${key}]`)
        .val(this.data[key]);
    }

    this.title.text(this.data.firstName + " " + this.data.lastName);
  },

  openEdit: function() {
    this.infoBody
      .fadeOut(200)
      .promise()
      .then(() => this.editForm.fadeIn(200));
    this.editButton
      .fadeOut(200)
      .promise()
      .then(() => this.saveBtn.fadeIn(200));
  },

  saveEdit: function() {
    var data = {};
    var elems = $(this.editForm)
      .find("form")
      .serializeArray()
      .forEach(e => {
        data[e.name] = e.value;
      });
    $.ajax({
      url: "/clients/" + this.id,
      data,
      method: "PATCH",
      success: () => {
        $("#clientsTable").bootstrapTable("refresh");
        this.loadData(this.id);
        this.closeEdit();
        $(this.editForm)
          .find("form")[0]
          .reset();
      },
      fail: this.warnEdit,
      async: false
    });
  },

  warnEdit: function(fields) {
    alert("COULD NOT SAVE");
  },

  closeEdit: function() {
    this.editForm
      .fadeOut(200)
      .promise()
      .then(() => this.infoBody.fadeIn(200));
    this.saveBtn
      .fadeOut(200)
      .promise()
      .then(() => this.editButton.fadeIn(200));
  }
});

$(document).ready(function() {
  $("#clientModal").clientModal();
});
