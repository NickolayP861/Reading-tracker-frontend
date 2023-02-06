window.historyPage= {
  app: null,
  modal: null,
  filters: {},
  content: document.querySelector('.content'),

  init(app, modal) {
    this.app = app;
    this.modal = modal;
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
    return this.content.querySelector('.panel_history');
  },

  updateData() {
    fetch(helpers.constants.baseApiUrl + 'get_story_reads?' + this.getGetStoryReadsParams() + '&token=' + this.app.getToken(), {
      headers: {
        token: this.app.getToken(),
      },
      method: 'GET',
    }).then(function (response) {
      return response.json();
    }.bind(this)).then(function (data) {
      console.log(data);

      let reads = '';
      for (const key in data) {
        const read = data[key];

        const bookName = read.bookName ? read.bookName : '-';
        const genre = read.genre ? read.genre : '-';
        const pages = read.pages ? read.pages : '-';
        const timestamp = read.timestamp;
        const date = (new Date(timestamp*1000)).toISOString().substring(0, 10);;

        reads += `<tr>
                    <td>${date}</td>
                    <td>${pages} стр.</td>
                    <td>${genre}</td>
                    <td>${bookName}</td>
                  </tr>`;

        
      }

      document.querySelector('.history tbody').innerHTML = reads;
    }.bind(this));
  },
  
  updateBooks()
  {
    
    fetch(helpers.constants.baseApiUrl + 'get_books_list', {
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

      // document.querySelector('.panel_history [name="filter_book"]').innerHTML = options;
      document.querySelectorAll('select[name="filter_book"]').forEach(item => item.innerHTML = options);
    }.bind(this));
  },

  getGetStoryReadsParams() {
    return new URLSearchParams(this.filters)
  },
}