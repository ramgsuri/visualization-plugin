const barChartData = {
    type: 'bar',
    data: {
        labels: null,
        datasets: []
      },
    options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: ''
          }
        }
    }
  };

const pieChartData = {
    type: 'pie',
    data: {
        labels: null,
        datasets: [{
            data: []
        }]
    },
    options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Total Carbon Emissions'
          }
        }
      },
};

module.exports = {
    barChartData,
    pieChartData
};