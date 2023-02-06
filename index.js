// import './helpers.js';
// import modal from './modal.js';
// import faq from './faq.js';
// import profile from './profile.js';
// import books from './books.js';

const app = {
  page: 'faq',
  pageModule: null,
  init() {
    modal.init(this);
    faq.init(this, modal);
    profile.init(this, modal);
    books.init(this, modal);
    historyPage.init(this, modal);
    filters.init();
    graphs.init(this, modal)

    document.querySelectorAll('input[type="password"]').value = '';
    helpers.addListener('.menu__item a', 'click', this.turnPage, this);


    $('input[type="dates"]').on('apply.daterangepicker', function (ev, picker) {
        // if (picker.startDate.length && picker.endDate.length) {
          $(this).val(picker.startDate.format(picker.locale.format) + ' - ' + picker.endDate.format(picker.locale.format));
        // }
    });

    $('input[type="dates"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    $('input[type="dates"]').daterangepicker({
      autoUpdateInput: false,
      locale: {
        format: 'DD.MM.YYYY',
      },
    });

    this.pageModule = faq;
  },

  showLoginModal() {
      modal.showLoginContent();
  },

  turnPage(e) {
    const page = e.target.getAttribute('href').slice(1); // Страница, на которую переключаемся

    if (!this.getToken() && page != 'faq') { // Проверка на токен
      this.showLoginModal();

      return;
    }

    if (this.page === page) return; // Если страница не изменилась, ничего не делаем
    this.page = page;

    const content = document.querySelector('.content'); // Изменить контент
    const contentToTurn = content.cloneNode(true);
    this.updateContent(content);

    this.changeBookmark(e.target.parentElement); // Изменить закладку

    document.body.append(contentToTurn);

    setTimeout(() => {
      contentToTurn.classList.add('turn'); // Анимация переворачивания страницы
      setTimeout(() => {
        contentToTurn.remove(); // Удаление
      }, 1200);

      switch (this.page) { // Переключить страницу
        case 'profile':
          this.showProfile(content);
          break;
        case 'faq':
          this.showFaq(content);
          break;
        case 'books':
          this.showBooks(content);
          break;
        case 'history':
          this.showHistory(content);
          break;
        case 'graph':
          this.showGraphs(content);
          break;
      }
    },100);


  },

  changeBookmark(elem) {
    document.querySelector('.menu__item_selected').classList.remove('menu__item_selected');
    elem.classList.add('menu__item_selected');

    elem.querySelector('.bookmark-triangle').style.borderLeftWidth = `${elem.offsetWidth/2}px`;
    elem.querySelector('.bookmark-triangle').style.borderRightWidth = `${elem.offsetWidth/2}px`;
  },

  showProfile() {
    this.page = 'profile';
    this.pageModule.hide();
    this.pageModule = profile;
    profile.show();
  },

  showFaq() {
    this.pageModule.hide();
    this.pageModule = faq;
    faq.show();
  },

  showBooks() {
    this.pageModule.hide();
    this.pageModule = books;
    books.show();
  },

  showHistory() {
    this.pageModule.hide();
    this.pageModule = historyPage;
    historyPage.show();
  },

  updateContent(content) {
    faq.content = content;
    profile.content = content;
    books.content = content;
  },

  showGraphs() {
    this.pageModule.hide();
    this.pageModule = graphs;
    graphs.show();
  },

  getToken() {
    return sessionStorage.getItem('token');
  }
}

document.addEventListener('DOMContentLoaded', app.init.bind(app));