import "../sass/common.scss";
import flashes from "./modules/flashes";
flashes();

import BulmaCommon from "./BulmaCommon";
import { $$ } from "./modules/Bling";

BulmaCommon();

// TODO: Refactor
$$(".file-input").on("change", e => {
  const input = e.target;
  input.parentNode.querySelector(".file-name").innerHTML = input.files[0].name;
});
