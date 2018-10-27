class Table {
  constructor(elem, resource) {
    this.elem = elem;
    this.resource = resource;

    this.getData().then(() => {
      this.filterOptions = { fields: {}, filterStr: '' };
      this.metaData.defaultTableHeadings.forEach(
        e => (this.filterOptions.fields[e] = true),
      );

      this.sortOptions = {
        sortBy: this.metaData.defaultTableHeadings[0],
        sortDir: 1,
      };

      this.buildUI(this.resource, this.metaData, this.elem);
      this.bindUI();

      this.updateHeadings(this.filterOptions, this.sortOptions);
      this.populateTable();
    });
  }

  async getData() {
    this.metaData = (await axios.get(`/metadata/${this.resource}s`)).data;
    this.data = (await axios.get(
      `/${this.resource}s?fields=${this.metaData.defaultTableHeadings.join()}`,
    )).data.doc;
  }

  prepData() {
    // sort
    const sortedData = this.sortData(
      this.data,
      this.metaData,
      this.sortOptions,
    );

    // format
    const formattedData = this.formatData(sortedData, this.metaData);

    // filter
    const filteredData = this.filterData(formattedData, this.filterOptions);

    return filteredData;
  }

  updateHeadings(filterOptions, sortOptions) {
    $('.thOptions', this.elem).forEach(
      e =>
        (e.className = `thOptions noSort ${
          filterOptions.filterStr === '' ? 'filtering' : ''
        }`),
    );

    const sortHeading = $(
      `#${sortOptions.sortBy}Heading .thOptions`,
      this.elem,
    )[0];
    sortHeading.classList.remove('noSort');
    sortHeading.classList.add(
      `${sortOptions.sortDir == 1 ? 'sortUp' : 'sortDown'}`,
    );

    for (const heading in filterOptions.fields) {
      $(`#${heading}Heading .thOptions`)[0].classList.add(
        filterOptions.fields[heading] ? 'include' : 'noInclude',
      );
    }
  }

  buildUI(resource, metaData, elem) {
    let headerString = '';

    metaData.defaultTableHeadings.forEach(heading => {
      headerString += `
      <th id='${heading}Heading' data-heading=${heading}>
        <span class="thTitle">${metaData.fields[heading].label}</span>
        <span class='thOptions'>
          <span class='sortIcons'>
            <span class="noSort">
              <i class="fas fa-sort"></i>
            </span>
            <span class="up">
              <i class="fas fa-sort-up"></i>
            </span>
            <span class="down">
              <i class="fas fa-sort-down"></i>
            </span>
          </span>
          <label class="includeCheck" data-heading=${heading}>
            <span class="include">
              <i class="fas fa-check-square"></i>
            </span>
            <span class="noInclude">
              <i class="fas fa-square"></i>
            </span>
          
          <i class="fas fa-search"></i> 
          </label>
        </span>
      </th>`;
    });

    elem.querySelector('thead tr').innerHTML = headerString;

    elem.querySelector('.tableHeading h2').innerHTML = resource + 's';
    elem.querySelector('.tableHeading  .newButton').innerHTML =
      'New ' + resource;
  }

  bindUI() {
    $('.searchInput', this.elem).on('input', e => {
      this.filterOptions.filterStr = e.target.value;
      this.populateTable();
    });

    $('th', this.elem).on('click', e => {
      const heading = e.target.closest('*[data-heading]').dataset.heading;

      if (heading === this.sortOptions.sortBy) {
        this.sortOptions.sortDir++;
        if (this.sortOptions.sortDir == 3) {
          this.sortOptions.sortDir = 1;
        }
      } else {
        this.sortOptions = {
          sortBy: heading,
          sortDir: 1,
        };
      }

      this.updateHeadings(this.filterOptions, this.sortOptions);
      this.populateTable();
    });

    $('th label', this.elem).on('click', e => {
      const heading = e.target.closest('*[data-heading]').dataset.heading;
      this.filterOptions.fields[heading] = !this.filterOptions.fields[heading];

      this.updateHeadings(this.filterOptions, this.sortOptions);
      this.populateTable();

      e.stopPropagation();
    });
  }

  formatData(data) {
    return data.map(record => {
      const newRecord = {};
      for (const key of this.metaData.defaultTableHeadings) {
        if (key[0] === '_') continue;
        newRecord[key] = this.formatItem(
          record[key],
          this.metaData.fields[key].type,
        );
      }

      return newRecord;
    });
  }

  formatItem(item, type) {
    if (item === undefined) {
      return '-';
    }

    if (type == 'Date') {
      return moment(item).format('MMM DD YYYY');
    }

    if (type === 'Boolean') {
      return item ? 'Yes' : 'No';
    }

    return item.toString();
  }

  filterData(data, filterOptions) {
    if (filterOptions.filterStr === '') {
      return data;
    }

    return data.filter(record => {
      for (const key in record) {
        if (key[0] === '_' || !filterOptions.fields[key]) continue;

        const item = record[key].toLowerCase();
        if (item.indexOf(filterOptions.filterStr.toLowerCase()) >= 0) {
          return true;
        }
      }
      return false;
    });
  }

  sortData(data, metaData, options) {
    const sorted = data.sort((a, b) =>
      this.sortItem(
        a[options.sortBy],
        b[options.sortBy],
        metaData.fields[options.sortBy].type,
      ),
    );

    if (options.sortDir == 2) {
      sorted.reverse();
    }

    return sorted;
  }

  sortItem(a, b, type) {
    if (a === undefined) {
      return 1;
    }

    if (a === b) {
      return 0;
    }

    if (type == 'Date') {
      return moment.utc(a).diff(moment.utc(b));
    }

    if (type == 'Number') {
      return parseFloat(a) - parseFloat(b);
    }

    return a < b ? -1 : 1;
  }

  populateTable() {
    const data = this.prepData();
    let bodyString = '';
    data.forEach(item => {
      bodyString += '<tr>';
      this.metaData.defaultTableHeadings.forEach(heading => {
        bodyString += `<td>${item[heading]}</td>`;
      });
      bodyString += '</tr>';
    });

    this.elem.querySelector('tbody').innerHTML = bodyString;
  }
}

const table = new Table($('#systems')[0], 'system');
const table2 = new Table($('#clients')[0], 'client');
const table3 = new Table($('#invoices')[0], 'invoice');
