window.helpers = {
  constants: {
    baseApiUrl: 'https://backend-api.npolyanskiy365.repl.co/api/', // URL бэкенда
  },

  show(elem) { // Показать элемент
    elem.removeAttribute('hidden');
  },

  hide(elem) { // Скрыть элемент
    elem.setAttribute('hidden', '');
  },

  addListener(selector, event, callback, context = {}) { // Повесить обработчик
    document.addEventListener(event, function (e) {
      if (e.target.matches(selector)) {
        callback.call(this, e);
      }
    }.bind(context))
  },

  detach(node) { // Удалить элемент из DOM
    return node.parentElement.removeChild(node);
  },
}