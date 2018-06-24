$.widget("app.contractorsPanel", {
  _init: function() {
    this.addButton = $(this.element).find(".addBtn");
    this.inputField = $(this.element).find("#newContInput");
    this.body = $(this.element).find("#contractorBody");

    this.addButton.click(this.addBtnClicked);
    this.inputField.keypress(this.inputKeyDown);

    this.loadData();
  },

  buildRowHTML() {
    this.body.empty();
    this.data.forEach(contractor => {
      var row = $(`<div class="contractorListItem">
          <span class="contractorName">${contractor.name}</span>
          <button class="btn btn-danger delBtn"><i class="fas fa-trash-alt"></i></button>
          <button class="btn btn-warning editBtn"><i class="fas fa-pencil-alt"></i></button>
      </div>`);

      var del = row
        .find(".delBtn")
        .data("inspId", contractor._id)
        .data("inspName", contractor.name)
        .click(this.deleteBtnClicked);

      var edit = row
        .find(".editBtn")
        .data("inspId", contractor._id)
        .data("inspName", contractor.name)
        .data("status", "ready")
        .click(this.editBtnClicked);

      row.appendTo(this.body);
    });
  },

  loadData: function() {
    $.ajax({
      url: "/contractors/",
      success: res => {
        this.data = res.doc;
      },
      async: false
    });
    this.buildRowHTML();
  },

  deleteBtnClicked: function() {
    var id = $(this).data("inspId");
    var name = $(this).data("inspName");

    if (confirm(`Are you sure you wish to delete ${name}?`)) {
      $.ajax({
        url: "/contractors/" + id,
        async: false,
        method: "delete"
      });

      $("#contractors").contractorsPanel("loadData");
    }
  },

  addBtnClicked() {
    $("#contractors").contractorsPanel("postNewName");
  },

  inputKeyDown(e) {
    if (e.which == "13") {
      $("#contractors").contractorsPanel("postNewName");
    }
  },

  postNewName: function(name) {
    var name = $("#newContInput")
      .val()
      .trim();

    if (name != "") {
      $.ajax({
        url: "/contractors/",
        data: { name },
        async: false,
        method: "post"
      });

      $("#contractors").contractorsPanel("loadData");
      $("#contractors input").val("");
    }
  },

  editBtnClicked: function() {
    var status = $(this).data("status");
    var row = $(this).parent();
    var label = row.find(".contractorName");

    if (status == "ready") {
      var editInput = $(`<input type='text' class='nameEdit'/>`).val(
        label.text()
      );
      $(this).text("Save");

      label.hide();
      editInput.insertAfter(label);

      $(this).addClass("activeEdit");

      $(this).data("status", "editing");

      $("#contractors").contractorsPanel("lockEdit", true);
    } else {
      var input = row.find("input").val();

      $.ajax({
        url: "/contractors/" + $(this).data("inspId"),
        data: { name: input },
        async: false,
        method: "patch"
      });

      $("#contractors").contractorsPanel("lockEdit", false);
      $("#contractors").contractorsPanel("loadData");
    }
  },

  lockEdit: function(set) {
    if (set) {
      $(this.element).addClass("editLocked");
    } else {
      $(this.element).removeClass("editLocked");
    }
  }
});

$(document).ready(function() {
  $("#contractors").contractorsPanel();
});
