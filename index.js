const fs = require('fs')
const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");
const csv = require('csv-parser')

Chart.register(...registerables);

const Visualization = (globalConfig) => {

    console.log(globalConfig)
    const metadata = {
        kind: 'execute',
    };

    async function fetchDataFromCSV(csvFilePath) {
        let results = [];

        const csvPromise = new Promise((resolve, reject) =>
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on("error", (err) => reject(err))
        );
        return await csvPromise;
    }

    async function createGraph(inputFilePath, outputFilePath) {
        const data = await fetchDataFromCSV(inputFilePath);
        console.log("DEBUG: Data", data)

        const canvas = createCanvas(800, 600);
        const ctx = canvas.getContext('2d');

        const legend1 = data[0].Path;
        const legend2 = data[1].Path;

        const labels = [];
        for (let key in data[0]) {
            if (key != "Path")
                labels.push(key)
        }

        delete data[0].Path;
        delete data[1].Path;

        const dataset1 = Object.values(data[0]);
        const dataset2 = Object.values(data[1]);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: legend1,
                    data: dataset1,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                },
                {
                    label: legend2,
                    data: dataset2,
                    borderColor: 'rgb(50, 50, 50)',
                    borderWidth: 1
                }]
            }
        });

        const imageBuffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputFilePath, imageBuffer);
    };

    const execute = async (inputs, config) => {
        const outputPath = config['output-path'];
        console.log("Inputs", inputs)
        console.log("Config", config)

        return inputs.map(input => {
            let inputPath = input['data-source'];
            // read the data and create Graph
            createGraph(inputPath, outputPath);

            // return {
            //     ...input,
            //     [outputParameter]: outputValue
            // };
        });
    };

    return {
        metadata,
        execute,
    };
};

Visualization()

exports.Visualization = Visualization;
