$.widget("app.specsPanel", {
  _init: function() {
    this.addButton = $(this.element).find(".addBtn");
    this.inputField = $(this.element).find("#newSpecInput");
    this.inputFieldFile = $(this.element).find("#newSpecInputFile");
    this.body = $(this.element).find("#specBody");

    this.inputFieldFile.change(e => {
      var formData = new FormData();
      formData.append("file", e.target.files[0], e.target.files[0].name);

      $("#specs .addBtn")
        .attr("disabled", "disabled")
        .text("Uploading...");

      $.ajax({
        url: "/file/upload",
        data: formData,
        processData: false,
        contentType: false,
        type: "POST",
        success: res => {
          $("#newSpecInputFile").data("db_id", res.doc._id);
          $("#specs .addBtn")
            .removeAttr("disabled")
            .text("Add Spec");
        }
      });
    });

    this.addButton.click(this.addBtnClicked);
    this.inputField.keypress(this.inputKeyDown);

    this.loadData();
  },

  buildRowHTML() {
    this.body.empty();
    this.data.forEach(spec => {
      var fileName;
      $.ajax({
        url: "/file/info/" + spec.file,
        success: res => {
          fileName = res.doc.uploadName;
        },
        async: false
      });

      var row = $(`<div class="specListItem">
            <span class="specName">${spec.name}</span>
            <button class="btn btn-danger delBtn"><i class="fas fa-trash-alt"></i></button>
            <button class="btn btn-warning editBtn"><i class="fas fa-pencil-alt"></i></button>
            <span class="specFileName"><a href="/file/${fileName}" target="_blank">${fileName}</a></span>

        </div>`);

      var del = row
        .find(".delBtn")
        .data("inspId", spec._id)
        .data("inspName", spec.name)
        .click(this.deleteBtnClicked);

      var edit = row
        .find(".editBtn")
        .data("inspId", spec._id)
        .data("inspName", spec.name)
        .data("status", "ready")
        .click(this.editBtnClicked);

      row.appendTo(this.body);
    });
  },

  loadData: function() {
    $.ajax({
      url: "/specs/",
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
        url: "/specs/" + id,
        async: false,
        method: "delete"
      });

      $("#specs").specsPanel("loadData");
    }
  },

  addBtnClicked() {
    $("#specs").specsPanel("postNewSpec");
  },

  inputKeyDown(e) {
    if (e.which == "13") {
      $("#specs").specsPanel("postNewSpec");
    }
  },

  postNewSpec: function(name) {
    var name = $("#newSpecInput")
      .val()
      .trim();

    if (name == "" || file == "") {
      return alert("Ensure Spec name and file are specified");
    }
    var file = $("#newSpecInputFile").data("db_id");
    $("#newSpecInputFile").data("db_id", "");

    $("#specs .addBtn").text("No File");
    $.ajax({
      url: "/specs/",
      data: { name, file },
      async: false,
      method: "post"
    });

    $("#specs").specsPanel("loadData");
    $("#specs input").val("");
  },

  editBtnClicked: function() {
    var status = $(this).data("status");
    var row = $(this).parent();
    var label = row.find(".specName");

    if (status == "ready") {
      var editInput = $(`<input type='text' class='nameEdit'/>`).val(
        label.text()
      );
      $(this).text("Save");

      label.hide();
      editInput.insertAfter(label);

      $(this).addClass("activeEdit");

      $(this).data("status", "editing");

      $("#specs").specsPanel("lockEdit", true);
    } else {
      var input = row.find("input").val();

      $.ajax({
        url: "/specs/" + $(this).data("inspId"),
        data: { name: input },
        async: false,
        method: "patch"
      });

      $("#specs").specsPanel("lockEdit", false);
      $("#specs").specsPanel("loadData");
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
  $("#specs").specsPanel();
});
