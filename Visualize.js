const { createCanvas } = require('canvas');
const { Chart, registerables } = require('chart.js');
const csv = require('csv-parser');
const fs = require('fs');

Chart.register(...registerables);

async function fetchDataFromCSV(csvFilePath) {
    const results = [];

    const csvPromise = new Promise((resolve, reject) =>
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err))
    );
    return await csvPromise;
}

const createDatasets = function (rows) {
    return rows
        .map(row => {
            const { Path, ...data } = row;
            return [Path, data];
        })
        .map(([label, rowData]) => {
            return {
                label: label,
                data: Object.values(rowData),
                borderWidth: 1
            };
        });
};

async function createGraph(filePath) {
    const data = await fetchDataFromCSV(filePath);
    if (data.length === 0) {
        console.error('No data found in the input source');
        return;
    }

    const { Path: _, ...rowWithDataKeys } = data[0];
    const labels = Object.keys(rowWithDataKeys);
    const datasets = createDatasets(data);

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        }
    });

    const imageBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync('chart.png', imageBuffer);
}

createGraph('./computed.csv');
