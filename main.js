if (annyang) {
  const commands = {
    'hello': () => alert('Hello World'),

    'change the color to *color': (color) => {
      console.log("Color change command good:", color);
      if (document.body) {
        document.body.style.backgroundColor = color;
      }
    },

    'navigate to *page': (page) => {
      console.log("Navigation good:", page);
      location.href = page.toLowerCase() + '.html';
    },

    'lookup *stock': (stock) => {
      console.log('Voice heard', stock);
      const input = document.getElementById('ticker');
      const range = document.getElementById('range');
      if (input && range) {
        input.value = stock.toUpperCase();
        setTimeout(() => fetchStock(), 300); // ensures there is enough time between th evoice heard to actually look it up, otherwise without this line it just enters [ticker] into the textbox, but doesn't search it
      } else {
        console.warn("ticker not found");
      }
    },

    'load dog breed *breed': (breed) => {
      console.log("Dog breed heard:", breed);
      if (typeof loadBreedData === 'function') {
        loadBreedData(breed);
      }
    }
  };

  annyang.addCommands(commands);

  annyang.addCallback('result', function (phrases) {
    console.log("🔊 Heard:", phrases);
  });

  annyang.start();
}

// Define fetchStock globally, had issues otherwise
function fetchStock() {
  const tickerInput = document.getElementById('ticker');
  const rangeInput = document.getElementById('range');
  const chartCanvas = document.getElementById('stockChart');

  

  const ticker = tickerInput.value.toUpperCase();
  const days = parseInt(rangeInput.value);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const from = startDate.toISOString().split('T')[0];
  const to = endDate.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=l3rjTP1xglMd351OzU6xbEK7jei6IeSn`;

  fetch(url)
    .then(res => res.json())
    .then(json => {
      if (!json.results || json.results.length === 0) {
        alert("No data found for ticker");
        return;
      }

      const labels = json.results.map(r => new Date(r.t).toLocaleDateString());
      const prices = json.results.map(r => r.c);

      const ctx = chartCanvas.getContext('2d');
      if (window.stockChartInstance) {
        window.stockChartInstance.destroy();
      }

      window.stockChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `Closing Price`,
            data: prices,
            borderWidth: 2,
            fill: false,
            borderColor: 'blue'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: false }
          }
        }
      });
    })
  
}
