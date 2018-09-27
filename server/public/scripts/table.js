class Table {
  constructor(elem, resource) {
    this.elem = elem;
    this.resource = resource;

    this.getData();
  }

  populateTable() {
    let headerString = "";

    this.metaData.defaultTableHeadings.forEach(heading => {
      headerString += `<th>${this.metaData.fields[heading].label}</th>`;
    });

    this.elem.querySelector("thead tr").innerHTML = headerString;

    this.elem.querySelector(".tableHeading h2").innerHTML = this.resource + "s";
    this.elem.querySelector(".tableHeading  .newButton").innerHTML =
      "New " + this.resource;

    let tempBodyString = "";
    for (let i = 0; i < 25; i++) {
      tempBodyString += "<tr>";
      for (let j = 0; j < this.elem.querySelectorAll("th").length; j++) {
        tempBodyString += `<td>${Math.floor(Math.random() * 10000)}</td>`;
      }
      tempBodyString += "</tr>";
    }

    this.elem.querySelector("tbody").innerHTML = tempBodyString;
  }

  bindUIActions() {
    // TODO
  }

  async getData() {
    this.metaData = (await axios.get(`/metadata/${this.resource}`)).data;

    this.populateTable();
    this.bindUIActions();
  }
}

const table = new Table($("#systemsTab")[0], "system");
const table2 = new Table($("#clientsTab")[0], "client");
const table3 = new Table($("#invoicesTab")[0], "invoice");
