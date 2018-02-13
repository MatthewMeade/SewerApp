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
});
