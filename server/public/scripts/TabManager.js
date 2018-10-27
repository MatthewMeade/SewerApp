class TabManager {
  constructor(elem) {
    this.body = $('body')[0];
    this.nav = $('nav')[0];

    this.tabs = {};
    this.activeTab = '';

    $('li:not(#logout)', this.nav).forEach(n => {
      const tabName = n.innerText.toLowerCase();
      this.tabs[tabName] = {
        navItem: n,
        bodyItem: $(`#${tabName}.tab`)[0],
        mainTab: true,
      };

      n.addEventListener('click', () => this.changeTab(tabName));
    });

    const url = window.location.href.split('#');
    if (url.length > 1) {
      this.changeTab(url.pop());
    } else {
      this.changeTab();
    }

    $('.logout', this.nav).on('click', () => {
      axios.delete('/users/me/token');
      window.location.href = '/';
    });
  }

  changeTab(name = 'home') {
    const activeTab = this.tabs[this.activeTab || 'home'];
    activeTab.navItem.classList.remove('active');
    activeTab.bodyItem.classList.remove('active');

    const newTab = this.tabs[name];
    newTab.navItem.classList.add('active');
    newTab.bodyItem.classList.add('active');

    this.activeTab = name;
  }

  addTab(resource, id) {
    const tabName = resource + id;

    const navItem = document.createElement('li');
    navItem.appendChild(document.createTextNode(tabName));
    $('#itemTabs', this.nav)[0].appendChild(navItem);

    const bodyItem = document.createElement('div');
    bodyItem.id = tabName;
    $('#tabs', this.body)[0].appendChild(bodyItem);

    this.tabs[tabName] = {
      navItem,
      bodyItem,
      mainTab: false,
    };

    navItem.addEventListener('click', () => this.changeTab(tabName));

    new ItemTab(resource, id, bodyItem);

    this.changeTab(tabName);
  }
}

const tabManager = new TabManager();
