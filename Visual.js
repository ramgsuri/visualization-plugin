const {createCanvas} = require("canvas");
const Chart = require("chart.js");
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
function fetchDataFromCSV(csvFilePath) {
    // Create an array to store the data from the CSV file
    const results = [];
    console.log(csvFilePath);
    // Use fs.createReadStream() to read the CSV file
    fs.createReadStream('computed.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results);
            // [
            //   { NAME: 'Daffy Duck', AGE: '24' },
            //   { NAME: 'Bugs Bunny', AGE: '22' }
            // ]
        });

}

function createGraph() {
    // Fetch data
    let filePath = '/Users/ramgsuri/Documents/personal/Personal/Coding/gsf_plugin/my-plugin/visualization-plugin-gsft/computed.csv';
    const data = fetchDataFromCSV(filePath);
    console.log("Data", data)
    // Create canvas
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Create chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, index) => index.toString()),
            datasets: [{
                label: 'Data',
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Index'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    });

    // Save chart as image
    const imageBuffer = canvas.toBuffer('image/png');
    // You can save the imageBuffer to a file or send it over the network
    // For example, fs.writeFileSync('chart.png', imageBuffer);
}



createGraph();
