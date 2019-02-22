import { $, $$ } from "./Bling";

function setupFilters() {
  $$("select.searchable").forEach(select => {
    const inputName = select.dataset.filterinput;
    const searchInput = $(`input[name=${inputName}]`);
    const selectOptions = [...select.options];
    searchInput.on("change", e => {
      select.value = "";
      const filterStr = e.target.value.toLowerCase();
      console.log(filterStr);
      selectOptions.forEach(option => {
        option.style.display = option.text.toLowerCase().indexOf(filterStr) > -1 ? "list-item" : "none";
      });
    });
  });
}

module.exports = setupFilters;
