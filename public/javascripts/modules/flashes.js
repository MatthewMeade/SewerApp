import { $, $$ } from "./Bling";

export default () => {
  $$(".message .delete").on("click", a => {
    const message = a.target.parentElement.parentElement;
    message.classList.remove("open");
    message.classList.add("closed");
  });
};
