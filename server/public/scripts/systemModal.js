$.widget("app.systemModal", {
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
    this.data = {};
    $("#systemModal").modal({
      show: false,
      backdrop: "static",
      keyboard: false
    });

    this.title = $(this.element).find(".modal-title");
    this.body = $(this.element).find(".modal-body");
    this.footer = $(this.element).find(".modal-body");
    this.infoBody = $(this.element).find(".systemInfo");
    this.editForm = $(this.element).find(".systemFormContainer");
    this.editButton = $(this.element).find(".editBtn");
    this.saveBtn = $(this.element).find(".saveBtn");
    this.deleteBtn = $(this.element).find(".deleteBtn");

    this.editForm.fadeOut();
    this.saveBtn.fadeOut();

    $(this.element)
      .find(".close, .closeBtn")
      .click(this.close.bind(this));

    this.editButton.click(this.openEdit.bind(this));
    this.saveBtn.click(this.saveEdit.bind(this));
    this.deleteBtn.click(this.deleteSystem.bind(this));
  },

  reset: function() {
    this.id = undefined;
    this.title.text("");
    this.data = {};
    $(this.editForm)
      .find("form")[0]
      .reset();
  },

  open: function(id) {
    if (!id) {
      this.openEdit();
    } else {
      this.id = id;
      this.loadData();
    }

    $("#systemModal").modal("show");
  },

  close: function() {
    this.closeEdit();
    $("#systemModal").modal("hide");
    this.reset();
  },

  loadData: function() {
    $.ajax({
      url: "/systems/" + this.id,
      success: res => {
        this.data = res.system;
      },
      async: false
    });

    this.infoBody.find(".systemInfoPair").remove();
    for (key in this.options.keyValueLabels) {
      this.infoBody.append(`
            <div class='systemInfoPair col-lg-4 col-md-6'>
              <label>${
                this.options.keyValueLabels[key]
              }: </label> <span id='system${key}'>${this.data[key]}</span>
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

  createSystem(callback) {
    $.ajax({
      url: "/systems/",
      method: "POST",
      success: res => {
        this.id = res._id;
        callback();
      }
    });
  },

  saveEdit: function() {
    // Prevent changes made to focus since last blur not being saved
    $(":focus").blur();

    var formData = {};
    var elems = $(this.editForm)
      .find("form")
      .serializeArray()
      .forEach(e => {
        if (e.value) formData[e.name] = e.value;
      });

    //TODO: Replace with propper form validation
    if ($.isEmptyObject(formData)) {
      return alert("Can't save: No data");
    }

    if (!this.id) {
      return this.createSystem(this.saveEdit);
    }

    $.ajax({
      url: "/systems/" + this.id,
      data: formData,
      method: "PATCH",
      success: () => {
        $("#systemsTable").bootstrapTable("refresh");
        this.loadData(this.id);
        this.closeEdit();
      },
      fail: this.warnEdit,
      async: false
    });
  },

  warnEdit: function(fields, message) {
    alert(message || "COULD NOT SAVE");
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
  },

  deleteSystem: function() {
    if (confirm("Are you sure?")) {
      $.ajax({
        url: "/systems/" + this.id,
        method: "DELETE",
        success: () => {
          $("#systemsTable").bootstrapTable("refresh");
          this.close();
        },
        fail: this.warnEdit,
        async: false
      });
    }
  }
});

$(document).ready(function() {
  $("#systemModal").systemModal();
});
