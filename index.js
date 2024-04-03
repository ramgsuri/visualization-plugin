import { createCanvas } from 'canvas';
import Chart from 'chart.js';

const Visualization = (globalConfig) => {

    console.log(globalConfig)
    const metadata = {
        kind: 'execute',
    };

    // Function to fetch data from csv
    async function fetchDataFromCSV(csvFilePath: string): Promise<number[]> {
        // Create an array to store the data from the CSV file
        const data = [];
        // Use fs.createReadStream() to read the CSV file
        fs.createReadStream(csvFilePath)
            // Pipe the read stream to csv-parser to parse the CSV data
            .pipe(csv({ headers: true })) // Specify { headers: true } to parse the first row as headers
            // Use the 'data' event to capture each row of data
            .on('data', (row) => {
                // Push each row to the 'data' array
                data.push(row);
            })
            // Use the 'end' event to signal the end of the CSV parsing
            .on('end', () => {
                // Print the parsed data
                console.log(data);
            })
            // Handle errors
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
            });
    }

    // Function to create graph image and plot
    async function createGraph(): Promise<void> {
        // Fetch data
        let filePath = '';
        const data = await fetchDataFromCSV(filePath);

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

    const execute = async (inputs, config) => {
        const keepExisting = globalConfig['keep-existing'] === true;
        const inputParameter = config['from-param'];
        const outputParameter = config['to-param'];

        return inputs.map(input => {
            let outputValue = input[inputParameter];
            // read the data and create Graph

            let outputVisual = createGraph();
            if (input[inputParameter]) {
                if (!keepExisting) {
                    delete input[inputParameter];
                }
            }

            return {
                ...input,
                [outputParameter]: outputValue
            };
        });
    };

    return {
        metadata,
        execute,
    };
};
exports.Visualization = Visualization;
