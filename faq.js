window.faq= {
  app: null,
  modal: null,
  content: document.querySelector('.content'),

  init(app, modal) {
    this.app = app;
    this.modal = modal;
  },

  hide() {
    helpers.hide(this.getPanel());
  },

  show() {
    helpers.show(this.getPanel());
  },

  getPanel() {
    return this.content.querySelector('.panel_faq');
  }
}