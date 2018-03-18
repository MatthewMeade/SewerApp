$(document).ready(function() {
  $("#systemsTable").bootstrapTable({
    columns: [
      {
        field: "id",
        title: "System ID"
      },
      {
        field: "name",
        title: "Client Name"
      },
      {
        field: "date",
        title: "Date"
      }
    ],
    data: [
      {
        id: 1,
        name: "Matthew Meade",
        date: "Dec 11, 2019"
      },
      {
        id: 2,
        name: "Kenny Meade",
        date: "Oct 25, 2021"
      },
      {
        id: 3,
        name: "Meghan Meade",
        date: "May 10, 2020"
      }
    ]
  });

  $.widget("ui.systemModal", {
    open: function(id) {
      $(this.element).modal("show");
      $("#systemModalTitle").text("System: " + id);
    }
  });

  $("#systemModal").modal({ show: false });
  $("#systemModal").systemModal();

  $("#systemsTable tr").click(function(e) {
    $("#systemModal").systemModal(
      "open",
      e.target.parentNode.firstChild.innerText
    );
  });

  $("#logOutButton").click(() => {
    $.ajax({
      url: "/users/me/token",
      type: "DELETE"
    })
      .done(response => {
        window.location.href = "/";
      })
      .fail(err => {
        alert("ERROR: " + err);
        console.error(error);
      });
  });

  const urlTab = window.location.href
    .split("#")[1]
    .split("?")[0]
    .toLowerCase();
  $(`#${urlTab}-tab`).click();

  // const urlRow = window.location.href.split("=")[1];
  // setTimeout(() => $(`#${urlRow} td`)[1].click(), 500);
});
