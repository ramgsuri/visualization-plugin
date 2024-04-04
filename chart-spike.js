const fs = require("fs");
const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");


Chart.register(...registerables);

const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');

const label1 = 'tree.children.westus3.children.server-1.carbon';
const label2 = 'tree.children.westus3.children.server-2.carbon';

const labels = Object.keys({
    '2024-03-05T00:00:00.000Z': '0.1143371486195532',
    '2024-03-05T00:00:05.000Z': '0',
    '2024-03-05T00:00:10.000Z': '0',
    '2024-03-05T00:00:15.000Z': '0',
    '2024-03-05T00:00:20.000Z': '0',
    '2024-03-05T00:00:25.000Z': '0',
    '2024-03-05T00:00:30.000Z': '0',
    '2024-03-05T00:00:35.000Z': '0',
    '2024-03-05T00:00:40.000Z': '0',
    '2024-03-05T00:00:45.000Z': '0',
    '2024-03-05T00:00:50.000Z': '0',
    '2024-03-05T00:00:55.000Z': '0'
});

const dataset1 = Object.values({
    '2024-03-05T00:00:00.000Z': '0.1143371486195532',
    '2024-03-05T00:00:05.000Z': '0',
    '2024-03-05T00:00:10.000Z': '0',
    '2024-03-05T00:00:15.000Z': '0',
    '2024-03-05T00:00:20.000Z': '0',
    '2024-03-05T00:00:25.000Z': '0',
    '2024-03-05T00:00:30.000Z': '0',
    '2024-03-05T00:00:35.000Z': '0',
    '2024-03-05T00:00:40.000Z': '0',
    '2024-03-05T00:00:45.000Z': '0',
    '2024-03-05T00:00:50.000Z': '0',
    '2024-03-05T00:00:55.000Z': '0'
});

const dataset2 = Object.values({
    '2024-03-05T00:00:00.000Z': '0.1143371486195532',
    '2024-03-05T00:00:05.000Z': '1',
    '2024-03-05T00:00:10.000Z': '2',
    '2024-03-05T00:00:15.000Z': '3',
    '2024-03-05T00:00:20.000Z': '4',
    '2024-03-05T00:00:25.000Z': '6',
    '2024-03-05T00:00:30.000Z': '1',
    '2024-03-05T00:00:35.000Z': '2',
    '2024-03-05T00:00:40.000Z': '0',
    '2024-03-05T00:00:45.000Z': '3',
    '2024-03-05T00:00:50.000Z': '2',
    '2024-03-05T00:00:55.000Z': '1'
});

const data = {
    labels: labels,
    datasets: [{
        label: label1,
        data: dataset1,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    },
    {
        label: label2,
        data: dataset2,
        fill: false,
        borderColor: 'rgb(50, 50, 50)',
        tension: 0.1
    }]
};


new Chart(ctx, {
    type: 'line',
    data: data
});

const imageBuffer = canvas.toBuffer('image/png');
fs.writeFileSync('chart.png', imageBuffer);
