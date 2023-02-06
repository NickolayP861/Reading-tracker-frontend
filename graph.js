window.graphs= {
  app: null,
  modal: null,
  filters: {},
  content: document.querySelector('.content'),
  charts: {
    line: {
      config: {
        type: 'line',
        data: null,
        options: {
          plugins: {
            legend: {
              display: false,
            },
            tooltips: {
              enable: false
            },
          },
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },

      }
    },
    pie: {
      config: {
        type: 'pie',
        data: null,
        options: {
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltips: {
              enable: true
            },
          },
          responsive: true,
        },

      }
    }
  },
  inited: false,

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
    
    if (!this.inited) {
      this.charts.line = new Chart(document.querySelector('.graph1'), this.charts.line.config);
      this.charts.pie = new Chart(document.querySelector('.graph2'), this.charts.pie.config);
      this.inited = true;
    }

    this.charts.line.data.datasets = [
      {
        borderColor: '#663118',
        data: []
      }
    ];
    this.charts.pie.data.datasets = [
      {
        backgroundColor: ['#DEB887', '#663118', '#DEB887', '#7E3D1E', '#BE9E8E', '#FFEFD5'],
        data: []
      }
    ];
    window.charts = this.charts;
  },

  getPanel() {
    return this.content.querySelector('.panel_graphs');
  },

  updateData() {
    fetch(helpers.constants.baseApiUrl + 'get_story_reads?' + this.getGetStoryReadsParams(), {
      headers: {
        token: this.app.getToken(),
      },
      method: 'GET',
    }).then(function (response) {
      return response.json();
    }.bind(this)).then(function (data) {

      this.charts.line.data.datasets[0].data = [];
      this.charts.line.data.labels = [];
      this.charts.pie.data.datasets[0].data = [];
      this.charts.pie.data.labels = [];

      const labels = [];
      const pieData = [];

      let reads = '';
      for (const key in data) {
        const read = data[key];

        const bookName = read.book_name ? read.book_name : '-';
        const genre = read.genre ? read.genre : '-';
        const pages = read.pages ? +read.pages : '-';
        const timestamp = read.timestamp;
        const date = (new Date(timestamp*1000)).toISOString().substring(0, 10);

        let isLabelAdded = false;
        labels.forEach(label => {
          if (label.timestamp === timestamp) {
            isLabelAdded = true;
          }
        });

        if (!isLabelAdded) {
          labels.push({date: date, timestamp: timestamp});
        }

        reads += `<tr>
                    <td>${date}</td>
                    <td>${pages} стр.</td>
                    <td>${genre}</td>
                    <td>${bookName}</td>
                  </tr>`;
        
        let added = false;

        this.charts.line.data.datasets[0].data.forEach(item => {
          if (item.x === date) {
            item.y += pages;
            added = true;
          }
        })
        
        if (!added) {
          this.charts.line.data.datasets[0].data.push({
            x: date,
            y: pages,
          });
        }
        
        let addedPie = false;

        pieData.forEach(item => {
          if (item.genre === genre) {
            addedPie = true;
            item.value += pages;
          }
        });
        
        if (!addedPie) {
          pieData.push({
            genre: genre,
            value: pages,
          });
        }
      }

      labels.sort((a, b) => {
        return a.timestamp > b.timestamp;
      });

      labels.forEach(label => {
        this.charts.line.data.labels.push(label.date);
      });

      console.log(pieData);

      pieData.forEach(item => {
        this.charts.pie.data.labels.push(item.genre);
        this.charts.pie.data.datasets[0].data.push(item.value);
      })

      console.log(this.charts.pie.data);
      this.charts.line.update();
      this.charts.pie.update();

      document.querySelector('.history tbody').innerHTML = reads;
    }.bind(this));
  },

  getGetStoryReadsParams() {
    return new URLSearchParams(this.filters)
  },
}