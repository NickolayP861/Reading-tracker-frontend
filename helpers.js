window.helpers = {
  constants: {
    baseApiUrl: 'https://laravel-9.limbuz.repl.co/api/',
  },

  show(elem) {
    elem.removeAttribute('hidden');
  },

  hide(elem) {
    elem.setAttribute('hidden', '');
  },

  addListener(selector, event, callback, context = {}) {
    document.addEventListener(event, function (e) {
      if (e.target.matches(selector)) {
        callback.call(this, e);
      }
    }.bind(context))
  },

  // debounce(func, wait, immediate) {
  //   var timeout, previous, args, result, context;
  
  //   var later = function() {
  //     var passed = now() - previous;
  //     if (wait > passed) {
  //       timeout = setTimeout(later, wait - passed);
  //     } else {
  //       timeout = null;
  //       if (!immediate) result = func.apply(context, args);
  
  //       if (!timeout) args = context = null;
  //     }
  //   };
  
  //   var debounced = restArguments(function(_args) {
  //     context = this;
  //     args = _args;
  //     previous = now();
  //     if (!timeout) {
  //       timeout = setTimeout(later, wait);
  //       if (immediate) result = func.apply(context, args);
  //     }
  //     return result;
  //   });
  
  //   debounced.cancel = function() {
  //     clearTimeout(timeout);
  //     timeout = args = context = null;
  //   };
  
  //   return debounced;
  // }
  
  
}