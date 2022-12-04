window.modal= {
  app: null,
  elem: document.querySelector('.modal'),
  status: document.querySelector('.modal__status p'),
  title: document.querySelector('.modal__title'),
  description: document.querySelector('.modal__description'),
  button: document.querySelector('.modal__button'),
  forms: {
    login1: document.querySelector('.login-form-1'),
    login2: document.querySelector('.login-form-2'),
    addPages: document.querySelector('.add-pages-form'),
    updateProfile: document.querySelector('.update-profile-form'),
    addBook: document.querySelector('.add-book-form'),
  },

  doneCallback: null,
  processFormCallback: null,

  currentForm: null,
  filledFields: {

  },
  

  statuses: {
    authed: 'Вы вошли в профиль',
    guest: 'Вы еще не авторизованы'
  },

  headers: {
    login: {
      step1: {
        title: 'Шаг 1 из 2',
        description: 'заполните данные для входа'
      },
      step2: {
        title: 'Шаг 2 из 2',
        description: 'заполните профиль',
      }
    },
    addPages: {
      title: 'Чтение',
      description: 'внесите новые страницы',
    },
    updateProfile: {
      title: 'Профиль',
      description: 'внесите актуальные данные',
    },
    addBook: {
      title: 'Новая книга',
      description: 'введите название, чтобы найти',
    }
  },
  
  buttonText: {
    login: {
      step1: 'Продолжить',
      step2: 'Создать профиль'
    },
    addPages: 'Внести страницы',
    updateProfile: 'Изменить профиль',
    addBook: 'Добавить',
  },

  init(app) {
    this.app = app;
    this.button.addEventListener('click', this.sendForm.bind(this));
    helpers.addListener('form', 'submit', function (e) {
      e.preventDefault();
    }, this);
    
    document.querySelector('.modal__close').addEventListener('click', function () {
      this.closeModal();
    }.bind(this))
  },

  showLoginContent() {
    this.currentForm = this.forms.login1;
    this.status.textContent = this.statuses.guest;
    this.title.textContent = this.headers.login.step1.title;
    this.description.textContent = this.headers.login.step1.description;
    this.button.textContent = this.buttonText.login.step1;
    helpers.show(this.currentForm);
    helpers.show(this.elem);
  },

  showAddPagesContent(doneCallback, processFormCallback) {
    this.currentForm = this.forms.addPages;
    this.status.textContent = this.statuses.authed;
    this.title.textContent = this.headers.addPages.title;
    this.description.textContent = this.headers.addPages.description;
    this.doneCallback = doneCallback;
    this.processFormCallback = processFormCallback;
    this.button.textContent = this.buttonText.addPages;
    helpers.show(this.currentForm);
    helpers.show(this.elem);
  },

  showUpdateProfileContent(doneCallback, processFormCallback) {
    this.currentForm = this.forms.updateProfile;
    this.status.textContent = this.statuses.authed;
    this.title.textContent = this.headers.updateProfile.title;
    this.description.textContent = this.headers.updateProfile.description;
    this.doneCallback = doneCallback;
    this.processFormCallback = processFormCallback;
    this.button.textContent = this.buttonText.updateProfile;
    helpers.show(this.currentForm);
    helpers.show(this.elem);
  },

  showAddBookContent(doneCallback, processFormCallback) {
    this.currentForm = this.forms.addBook;
    this.status.textContent = this.statuses.authed;
    this.title.textContent = this.headers.addBook.title;
    this.description.textContent = this.headers.addBook.description;
    this.doneCallback = doneCallback;
    this.processFormCallback = processFormCallback;
    this.button.textContent = this.buttonText.addBook;
    helpers.show(this.currentForm);
    helpers.show(this.elem);
  },

  sendForm() {
    this.currentForm.querySelectorAll('.error').forEach(item => {
      item.textContent = '';
    });

    this.currentForm.requestSubmit();
    if (!this.currentForm.checkValidity()) return false;
    let formData = new FormData(this.currentForm);

    for (const pair of formData.entries()) {
      this.filledFields[pair[0]] = pair[1];
    }

      formData = new FormData();

      for (const key in this.filledFields) {
        formData.append(key, this.filledFields[key]);
      }

      switch (this.currentForm) {
        case this.forms.login2:
          formData = this.login2ProcessForm(formData);
        default:
          if (this.processFormCallback) {
            formData = this.processFormCallback(formData);
            this.processFormCallback = null;
          }
      }

      if (this.currentForm !== this.forms.login1) {
        this.filledFields = {};
      }
      
      fetch(helpers.constants.baseApiUrl + this.currentForm.getAttribute('action'), {
        method: 'POST',
        body: formData
      }).then(function (response) {
        return response.json();
      }.bind(this)).then(function (data) {
        console.log(data);
        if (data.errors) {
          this.currentForm.querySelectorAll('.modal-form__field').forEach(item => {

            const name = item.querySelector('input').getAttribute('name');

            if (data.errors[name]) {
              console.log(data.errors[name][0]);
              item.querySelector('.error').textContent = data.errors[name][0];
            }
          });
        } else {
          switch (this.currentForm) {
            case this.forms.login2:
            case this.forms.login1:
              if (!this.loginSuccessResponse(data)) {
                return;
              }
            default:
              if (this.doneCallback) {
                this.doneCallback(data);
                this.doneCallback = null;
              } 
          }
          this.closeModal();
        }
      }.bind(this));
  },

  showLogin2Content()
  {
    helpers.hide(this.currentForm);
    this.currentForm = this.forms.login2;
    this.status.textContent = this.statuses.guest;
    this.title.textContent = this.headers.login.step2.title;
    this.description.textContent = this.headers.login.step2.description;
    this.button.textContent = this.buttonText.login.step2;
    helpers.show(this.currentForm);
    helpers.show(this.elem);
  },

  loginSuccessResponse(data) {
    if (data.error) {
      this.showLogin2Content();

      return false;
    }
    
    sessionStorage.setItem('token', data.token);
    this.app.showProfile();
    this.app.changeBookmark(document.querySelector('.menu__item:nth-child(5)'))

    return true;
  },

  login2ProcessForm(formData) {
    formData.set('timestamp_start', Date.parse(new Date())/1000);
    formData.set('timestamp_end', Date.parse(formData.get('timestamp_end'))/1000)

    return formData;
  },

  closeModal() {
    helpers.hide(this.elem);
    helpers.hide(this.currentForm);
  }
}