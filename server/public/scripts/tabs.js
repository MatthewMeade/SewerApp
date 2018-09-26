const changeTab = name => {
  $(".active").forEach(element => {
    element.classList.remove("active");
  });

  $(`nav li.${name}`)[0].classList.add("active");
  $(`#${name}Tab`)[0].classList.add("active");
};

$("nav li:not(#logout)").on("click", e => {
  changeTab(e.target.classList[0]);
});

$("#logout").on("click", () => {
  axios.delete("/users/me/token");
  window.location.href = "/";
});

const url = window.location.href.split("#");
if (url.length > 1) {
  changeTab(url.pop());
}
