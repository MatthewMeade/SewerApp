class Table {
  constructor(elem, resource) {
    this.elem = elem;
    this.resource = resource;

    this.getData();
  }

  populateTable(data) {
    let bodyString = "";
    data.forEach(item => {
      bodyString += "<tr>";
      this.metaData.defaultTableHeadings.forEach(heading => {
        bodyString += `<td>${this.format(item[heading], heading)}</td>`;
      });
      bodyString += "</tr>";
    });

    this.elem.querySelector("tbody").innerHTML = bodyString;
  }

  format(item, heading) {
    const type = this.metaData.fields[heading].type;

    if (item === undefined) {
      return "-";
    }

    if (type == "Date") {
      return moment(item).format("MMM DD YYYY");
    }

    if (type === "Boolean") {
      return item ? "Yes" : "No";
    }

    return item;
  }

  buildUI() {
    let headerString = "";

    this.metaData.defaultTableHeadings.forEach(heading => {
      headerString += `<th>${this.metaData.fields[heading].label}</th>`;
    });

    this.elem.querySelector("thead tr").innerHTML = headerString;

    this.elem.querySelector(".tableHeading h2").innerHTML = this.resource + "s";
    this.elem.querySelector(".tableHeading  .newButton").innerHTML =
      "New " + this.resource;

    $(".searchInput", this.elem).on("input", e => {
      this.filter(e.target.value);
    });
  }

  filter(filterStr) {
    const filteredData = this.data.filter(record => {
      for (const key in record) {
        if (key[0] === "_") continue;

        const item = this.format(record[key], key)
          .toString()
          .toLowerCase();
        if (item.indexOf(filterStr.toLowerCase()) >= 0) {
          return true;
        }
      }
      return false;
    });

    this.populateTable(filteredData);
  }

  async getData() {
    this.metaData = (await axios.get(`/metadata/${this.resource}s`)).data;
    this.data = (await axios.get(
      `/${this.resource}s?fields=${this.metaData.defaultTableHeadings.join()}`
    )).data.doc;

    this.buildUI(this.data);
    this.populateTable(this.data);
  }
}

const table = new Table($("#systemsTab")[0], "system");
const table2 = new Table($("#clientsTab")[0], "client");
const table3 = new Table($("#invoicesTab")[0], "invoice");
