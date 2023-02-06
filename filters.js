window.filters = {
  elem: null,

  init() {
    helpers.addListener('.filter, .filter__icon, .filter__text', 'click', this.toggleFilters, this);

    helpers.addListener('.filter__input', 'change', this.filterChange, this);
    $('[name="filter_date"]').on('apply.daterangepicker', function(ev, picker) {
      setTimeout(function () {
        this.filterChange();
      }.bind(this), 10);
    }.bind(this));
  },

  filterChange() {
    if (typeof this.onChange === 'function') {
      this.onChange(this.getFilters());
    }
  },

  toggleFilters(e) {
    console.log(this.elem);
    if (this.filtersForm().hidden) {
      helpers.show(this.filtersForm());
      this.elem.querySelector('.filter').classList.add('filter_active');
    } else {
      helpers.hide(this.filtersForm());
      this.elem.querySelector('.filter').classList.remove('filter_active');
    }
    document.querySelector('.panel_profile [name="filter_book"] option:first-child').removeAttribute('hidden');
  },

  filtersForm() {
    return this.elem.querySelector('.filters__form');
  },

  getFilters() {
    if (this.filtersForm().hidden) return {}
    else {
      result = {};
      let timestampStart = '';
      let timestampEnd = '';
      if (this.filtersForm().querySelector('[name="filter_date"]').value) {
        const dates = this.filtersForm().querySelector('[name="filter_date"]').value.split(' - ');

        result.timestamp_start = moment(dates[0], 'DD.MM.YYYY').unix();
        result.timestamp_end   = moment(dates[1], 'DD.MM.YYYY').unix();
      }

      const genre = this.filtersForm().querySelector('[name="filter_genre"]').value

      if (genre.length) {
        result.genre = genre;
      }

      const bookId = this.filtersForm().querySelector('[name="filter_book"]').value

      if (bookId.length) {
        result.book_id = +bookId;
      }

      return result;
    }
  },

  onChange: null,
}