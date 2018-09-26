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
    console.log(headerString);
    console.log(this.elem.querySelector("thead tr").innerHTML);
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
