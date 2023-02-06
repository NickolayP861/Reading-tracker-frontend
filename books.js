window.books= {
  app: null,
  modal: null,
  content: document.querySelector('.content'),
  autocompleteData: [],
  books: {},

  init(app, modal) {
    this.app = app;
    this.modal = modal;

    helpers.addListener('.add-book', 'click', this.showAddBookModal, this);

    let lastInputTime = 0;
    const delay = 1000;
  new Autocomplete('#autocomplete', {
      search: async function (input) {
        const data = await this.getAutocompleteData(input);
        if (!data) return [];
        return data;
      }.bind(this),
    });
  },

  hide() {
    helpers.hide(this.getPanel());
  },

  show() {
    helpers.show(this.getPanel());

    this.updateData();
  },

  getPanel() {
    return this.content.querySelector('.panel_books');
  },

  updateData() {
    fetch(helpers.constants.baseApiUrl + 'get_books_list?' + this.getUpdateBooksParams(), {
      headers: {
        token: this.app.getToken(),
      },
      method: 'GET',
    }).then(function (response) {
      return response.json();
    }.bind(this)).then(function (data) {
      console.log(data);

      let books = '';
      for (const key in data) {
        const book = data[key];

        const poster = book.poster ? book.poster : 'book.png';
        const name = book.name ? book.name : 'Имя не задано';
        const genre = book.genre ? book.genre : 'Без жанра';
        const pages = book.pages;

        books += `<div class="book">
                    <img src="${poster}" alt="" class="book__img">
                    <div class="book__title">${name}</div>
                    <div class="book_genre">${genre}</div>
                    <div class="book__description">Страниц: ${pages}</div>
                  </div>`;

        
      }

      document.querySelector('.books-list').innerHTML = books;
    }.bind(this));
  },

  getUpdateBooksParams() {
    return new URLSearchParams({
    })
  },

  getSearchBookParams(input) {
    return new URLSearchParams({
      query: input,
    })
  },

  showAddBookModal() {
    this.modal.showAddBookContent(this.addBooksDone.bind(this), this.processAddBooksForm.bind(this));
  },

  addBooksDone(data) {
    this.updateData();
  },

  processAddBooksForm(formData) {
    console.log(formData);
    const bookName = formData.get('book_query');
    console.log(bookName);
    const book = this.books[bookName];
    console.log(book);
    const genre = book.genre[0] ? book.genre[0] : 'Без жанра';

    const poster = book.poster ? book.poster.smallThumbnail : 'book.png';
    
    formData.delete('book_query');
    formData.set('name', book.name);
    formData.set('poster', poster);
    formData.set('genre', book.genre[0]);
    formData.set('is_read', 0);
    formData.set('in_progress', 1);
    formData.set('token', this.app.getToken());
    console.log(formData);
    return formData;
  },

  getAutocompleteData: _.debounce(async function(input) {
    console.log(input);
    this.autocompleteData = [];
    this.books = [];
    if (!input) return [];
    const response = await fetch(helpers.constants.baseApiUrl + 'search_book?' + this.getSearchBookParams(input), {headers: {token: this.app.getToken()}})
    const json = await response.json();
    console.log(json);
    if (json.errors) return [];
    
    let itemCounts = 0;

    let autocompleteData = [];

    json.forEach(function(item) {
      if (itemCounts === 4) return;
      autocompleteData.push(item.name);
      this.books[item.name] = item;
      itemCounts++;        
    }.bind(this));
    console.log(autocompleteData)
    return autocompleteData;
  }, 300, {leading: true}),

  // async getAutocompleteData(input) {
  //   console.log(input);
  //   this.autocompleteData = [];
  //   this.books = [];
  //   if (!input) return [];
  //   const response = await fetch(helpers.constants.baseApiUrl + 'search_book?' + this.getSearchBookParams(input))
  //   const json = await response.json();
  //   console.log(json);
  //   if (json.errors) return [];
    
  //   let itemCounts = 0;

  //   json.forEach(function(item) {
  //     if (itemCounts === 4) return;
  //     this.autocompleteData.push(item.name);
  //     this.books[item.name] = item;
  //     itemCounts++;        
  //   }.bind(this));
  //   return this.autocompleteData;
  // }
}