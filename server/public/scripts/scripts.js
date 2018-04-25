$(document).ready(function() {
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
