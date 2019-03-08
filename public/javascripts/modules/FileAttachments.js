import { $, $$ } from "./Bling";

import attachFileLabels from "./FileUploadLabels";

class AttachmentTable {
  constructor(table) {
    this.table = table;
    this.files = JSON.parse(table.dataset.files || "[]");
    console.log(this.files);

    this.addBtn = table.querySelector(".attachmentAddBtn");

    this.addBtn.on("click", this.addFile.bind(this));
    this.renderTableBody();
  }

  addFile() {
    let addInput = this.table.querySelector(".attachmentAddInput");
    const fileLabel = this.table.querySelector(".file-name");

    if (!addInput.value) return;

    addInput.classList.remove("attachmentAddInput");
    addInput.style.display = "none";
    addInput.name = `upload${Date.now()}`;

    fileLabel.innerHTML = "";

    this.table.appendChild(addInput);

    const newInputHTML = `<input type="file" class="file-input attachmentAddInput" />`;
    const label = this.table.querySelector(".file-label");
    label.innerHTML = newInputHTML + label.innerHTML;

    attachFileLabels();

    this.files.push(addInput.value.split("\\").pop());
    this.renderTableBody();
  }

  renderTableBody() {
    const name = this.table.dataset.name;

    const html = this.files
      .map(
        (file, index) => `
        <tr>
          <td>
            <a href="/files/uploads/${file}" target="_blank">
              <p>${file}</p>
            </a>
            <input type="text" name="${name}[${index}]" value="${file}" style="display: none"/>
          </td>
          <td>
            <p class="has-text-right">
              <a class="button is-danger attachmentDeleteBtn" data-file=${file}> Delete </a>
            </p>
          </td>
        </tr>
      `
      )
      .join("");

    this.table.querySelector("tbody").innerHTML = html || "<tr><td>No files attached</td></tr>";

    this.table.querySelectorAll(".attachmentDeleteBtn").on("click", e => {
      const file = e.target.dataset.file;
      this.files = this.files.filter(f => f != file);
      this.renderTableBody();
    });
  }
}

function setupFileAttachments() {
  $$(".fileAttachTable").forEach(table => new AttachmentTable(table));
}

module.exports = setupFileAttachments;
