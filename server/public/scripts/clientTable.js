$(document).ready(() => {
  $("#clientsTable").bootstrapTable({
    url: "/clients",
    responseHandler: function(res) {
      res.clients.forEach(c => {
        c.id = c._index;
        c.fullName = c.firstName + " " + c.lastName;
      });

      return res.clients;
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
        title: "DB_ID",
        visible: false
      },
      {
        field: "fullName",
        title: "Client Name"
      },
      {
        field: "email",
        title: "Email",
        formatter: value =>
          `<a href='mailto:${value}' target="_blank">${value}</a>`
      },
      {
        field: "homePhone",
        title: "Home Phone"
      },
      {
        field: "mobilePhone",
        title: "Mobile Phone"
      },
      {
        field: "streetAddress",
        title: "Street Address"
      },
      {
        field: "city",
        title: "City"
      },
      {
        field: "province",
        title: "Province"
      },
      {
        field: "postCode",
        title: "Post Code"
      }
    ],
    onClickRow: function(row, e, field) {
      $("#clientModal").clientModal("open", row._id);
    }
  });

  $(
    "<button class='btn btn-success'><i class='fas fa-plus'></i> Add Client</button>"
  )
    .prependTo("#clients .fixed-table-toolbar .columns")
    .click(() => {
      $("#clientModal").clientModal("open", undefined);
    });
});
