window.profile= {
  app: null,
  modal: null,
  email: null,
  password: null,
  timestampStart: null,
  filters: {},
  content: document.querySelector('.content'),

  init(app, modal) {
    this.app = app;
    this.modal = modal;

    helpers.addListener('.add-pages', 'click', this.showAddPagesModal, this);
    helpers.addListener('.open-profile', 'click', this.showUpdateProfileModal, this);  
  },

  hide() {
    helpers.hide(this.getPanel());
  },

  show() {
    filters.elem = this.getPanel();
    filters.onChange = function (filters) {
      this.filters = filters;
      this.updateData();
    }.bind(this);
    
    helpers.show(this.getPanel());
    this.updateData();
    this.updateBooks();
  },

  getPanel() {
    return this.content.querySelector('.panel_profile');
  },

  updateData() {
    fetch(helpers.constants.baseApiUrl + 'get_profit?' + this.getUpdateDataParams(), {
      headers: {
        token: this.app.getToken(),
      },
      method: 'GET',
    }).then(function (response) {
      return response.json();
    }.bind(this)).then(function (data) {
      const pages = data.pages_total ? data.pages_total : 0;
      const books = data.books_total ? data.books_total : 0;
      const pagesPerDay = data.pages_per_day ? data.pages_per_day : 0;
      const booksPerDay = data.books_per_day ? data.books_per_day : 0;
      const pagesStill = data.pages_still ? data.pages_still : 0;
      const booksStill = data.books_still ? data.books_still : 0;

      document.querySelector('.pages').textContent = pages;
      document.querySelector('.books').textContent = books;
      document.querySelector('.statistics-pages .statistics-item__value').textContent = pagesPerDay;
      document.querySelector('.statistics-books .statistics-item__value').textContent = booksPerDay;
      document.querySelector('.statistics-pages-left .statistics-item__value').textContent = pagesStill;
      document.querySelector('.statistics-books-left .statistics-item__value').textContent = booksStill;
  
    }.bind(this));
  },

  updateProfileData() {
    fetch(helpers.constants.baseApiUrl + 'get_profile?' + this.getGetProfileData(), {
      headers: {
        token: this.app.getToken(),
      },
      method: 'GET',
    }).then(function (response) {
      return response.json();
    }.bind(this)).then(function (data) {
      console.log(data);
      const name = data.name;
      const second_name = data.second_name;
      const need_pages = data.need_pages;
      const need_books = data.need_books;
      const timestamp_end = data.timestamp_end;
      const date = new Date(timestamp_end*1000);

      this.email = data.email;
      this.password = data.password;
      this.timestampStart = data.timestamp_start;

      // document.querySelector('.update-profile-form [name="name"]').value = name;
      // document.querySelector('.update-profile-form [name="second_name"]').value = second_name;
      document.querySelector('.update-profile-form [name="need_pages"]').value = need_pages;
      document.querySelector('.update-profile-form [name="need_books"]').value = need_books;
      document.querySelector('.update-profile-form [name="timestamp_end"]').value = date.toISOString().substring(0, 10);

      console.log(document.querySelector('.update-profile-form [name="timestamp_end"]'), date.toISOString().substring(0, 10));
  
  
    }.bind(this));
  },

  getUpdateDataParams() {
    return new URLSearchParams(this.filters)
  },

  getUpdateBooksParams() {
    return new URLSearchParams({
      in_progress: 1,
    })
  },

  getGetProfileData() {
    return new URLSearchParams({
    })
  },

  showAddPagesModal() {
    this.updateBooks();
    this.modal.showAddPagesContent(this.showAddPagesDone.bind(this), this.processAddPagesForm.bind(this));
  },

  showUpdateProfileModal() {
    this.updateProfileData();
    this.modal.showUpdateProfileContent(this.updateProfileDone.bind(this), this.processUpdateProfileForm.bind(this));
  },

  updateProfileDone(data) {
    if (!data.errors) {
      this.updateData();
    }
  },

  showAddPagesDone(data) {
    if (!data.errors) {
      this.updateData();
    } 
  },

  processAddPagesForm(formData) {
    formData.set('timestamp', Date.parse(formData.get('timestamp'))/1000);

    return formData;
  },

  processUpdateProfileForm (formData) {
    formData.set('timestamp_start', this.timestampStart);
    formData.set('timestamp_end', Date.parse(formData.get('timestamp_end'))/1000);
    formData.set('email', this.email);
    formData.set('password', this.password);

    return formData;
  },

  updateBooks() {
    fetch(helpers.constants.baseApiUrl + 'get_books_list?' + this.getUpdateBooksParams(), {
      headers: {
        token: this.app.getToken(),
      },
      method: 'GET',
    }).then(function (response) {
      return response.json();
    }.bind(this)).then(function (data) {
      console.log(data);

      let options = '<option value="">Не выбрано</option>';
      for (const key in data) {
        const book = data[key];
        options += `<option value="${book.id}">${book.name}</option>`;        
      }

      document.querySelector('.add-pages-form select').innerHTML = options;
      document.querySelectorAll('select[name="filter_book"]').forEach(item => item.innerHTML = options);
    }.bind(this));
  }
}