$.widget("app.inspectorsPanel", {
  _init: function() {
    this.addButton = $(this.element).find(".addBtn");
    this.inputField = $(this.element).find("#newInspInput");
    this.body = $(this.element).find("#inspectorBody");

    this.addButton.click(this.addBtnClicked);
    this.inputField.keypress(this.inputKeyDown);

    this.loadData();
  },

  buildRowHTML() {
    this.body.empty();

    if (!this.data) {
      return;
    }

    this.data.forEach(inspector => {
      var row = $(`<div class="inspectorListItem">
        <span class="inspectorName">${inspector.name}</span>
        <button class="btn btn-danger delBtn"><i class="fas fa-trash-alt"></i></button>
        <button class="btn btn-warning editBtn"><i class="fas fa-pencil-alt"></i></button>
    </div>`);

      var del = row
        .find(".delBtn")
        .data("inspId", inspector._id)
        .data("inspName", inspector.name)
        .click(this.deleteBtnClicked);

      var edit = row
        .find(".editBtn")
        .data("inspId", inspector._id)
        .data("inspName", inspector.name)
        .data("status", "ready")
        .click(this.editBtnClicked);

      row.appendTo(this.body);
    });
  },

  loadData: function() {
    $.ajax({
      url: "/inspectors/",
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
        url: "/inspectors/" + id,
        async: false,
        method: "delete"
      });

      $("#inspectors").inspectorsPanel("loadData");
    }
  },

  addBtnClicked() {
    $("#inspectors").inspectorsPanel("postNewName");
  },

  inputKeyDown(e) {
    if (e.which == "13") {
      $("#inspectors").inspectorsPanel("postNewName");
    }
  },

  postNewName: function(name) {
    var name = $("#newInspInput")
      .val()
      .trim();

    if (name != "") {
      $.ajax({
        url: "/inspectors/",
        data: { name },
        async: false,
        method: "post"
      });

      $("#inspectors").inspectorsPanel("loadData");
      $("#inspectors input").val("");
    }
  },

  editBtnClicked: function() {
    var status = $(this).data("status");
    var row = $(this).parent();
    var label = row.find(".inspectorName");

    if (status == "ready") {
      var editInput = $(`<input type='text' class='nameEdit'/>`).val(
        label.text()
      );
      $(this).text("Save");

      label.hide();
      editInput.insertAfter(label);

      $(this).addClass("activeEdit");

      $(this).data("status", "editing");

      $("#inspectors").inspectorsPanel("lockEdit", true);
    } else {
      var input = row.find("input").val();

      $.ajax({
        url: "/inspectors/" + $(this).data("inspId"),
        data: { name: input },
        async: false,
        method: "patch"
      });

      $("#inspectors").inspectorsPanel("lockEdit", false);
      $("#inspectors").inspectorsPanel("loadData");
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
  $("#inspectors").inspectorsPanel();
});
