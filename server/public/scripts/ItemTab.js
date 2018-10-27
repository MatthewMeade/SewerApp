class ItemTab {
  constructor(resource, id, bodyElem) {
    this.resource = resource;
    this.id = id;
    this.bodyElem = bodyElem;

    this.getData().then(() => (this.bodyElem.innerHTML = this.data));
  }

  async getData() {
    this.metaData = (await axios.get(`/metadata/${this.resource}s`)).data;
    this.data = JSON.stringify(
      (await axios.get(`/${this.resource}s`)).data.doc,
      undefined,
      2,
    );
  }
}
