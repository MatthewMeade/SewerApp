import { $, $$ } from "./Bling";

function setupToggle(modal, openBtn) {
  if (!modal || !openBtn) return;
  openBtn.on("click", () => modal.classList.add("is-active"));

  modal.querySelector(".modal-background").onclick = () => modal.classList.remove("is-active");
  modal.querySelector(".cancel").onclick = () => modal.classList.remove("is-active");
  modal.querySelector(".close").onclick = () => modal.classList.remove("is-active");
}

export default setupToggle;
