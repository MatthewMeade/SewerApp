import { $, $$ } from "./Bling";

function attachFileLabels() {
  $$(".file-input").on("change", e => {
    const input = e.target;
    input.parentNode.querySelector(".file-name").innerHTML = input.files[0].name;
  });
}

module.exports = attachFileLabels;
