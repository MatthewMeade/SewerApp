$("nav li:not(#logout)").on("click", e => {
  $(".active").forEach(element => {
    element.classList.remove("active");
  });

  e.target.classList.add("active");
  $("#" + e.target.innerText.toLowerCase() + "Tab")[0].classList.add("active");
});

$("#logout").on("click", () => {
  axios.delete("/users/me/token");
  window.location.href = "/";
});
