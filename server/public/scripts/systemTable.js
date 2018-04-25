$(document).ready(() => {
  $("#systemsTable").bootstrapTable({
    url: "/systems",
    responseHandler: function(res) {
      return res.systems;
    },
    striped: true,
    search: true,
    showColumns: true,
    showRefresh: true,
    iconsPrefix: "fas",
    icons: {
      paginationSwitchDown: "glyphicon-collapse-down icon-chevron-down",
      paginationSwitchUp: "glyphicon-collapse-up icon-chevron-up",
      refresh: "fa-sync-alt",
      toggle: "fa-list-alt",
      columns: "fa-th-list",
      detailOpen: "glyphicon-plus icon-plus",
      detailClose: "glyphicon-minus icon-minus"
    },
    columns: [
      {
        field: "_id",
        title: "DB_ID"
      },
      {
        field: "client",
        title: "Client Name"
      },
      {
        field: "location",
        title: "Location"
      },
      {
        field: "contractor",
        title: "Contractor"
      }
    ],
    onClickRow: function(row, e, field) {
      $("#systemModal").systemModal("open", row._id);
    }
  });

  $(
    "<button class='btn btn-success'><i class='fas fa-plus'></i> Add System</button>"
  )
    .prependTo("#systems .fixed-table-toolbar .columns")
    .click(() => {
      $("#systemModal").systemModal("open");
    });
});
