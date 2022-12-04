window.historyPage= {
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

    this.updateData();
  },

  getPanel() {
    return this.content.querySelector('.panel_history');
  },

  updateData() {
    fetch(helpers.constants.baseApiUrl + 'get_story_reads?' + this.getGetStoryReadsParams(), {
      method: 'GET',
    }).then(function (response) {
      return response.json();
    }.bind(this)).then(function (data) {
      console.log(data);

      let reads = '';
      for (const key in data) {
        const read = data[key];

        const bookName = read.book_name ? read.book_name : '-';
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

  getGetStoryReadsParams() {
    return new URLSearchParams({
      token: this.app.getToken(),
    })
  },
}