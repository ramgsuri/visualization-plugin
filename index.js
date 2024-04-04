const createCanvas = require('canvas').createCanvas;
const Chart = require('chart.js');


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

    async function createGraph(filePath) {
        const data = await fetchDataFromCSV(filePath);
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
        fs.writeFileSync('chart.png', imageBuffer);
    };

    const execute = async (inputs, config) => {
        const keepExisting = globalConfig['keep-existing'] === true;
        const inputParameter = config['from-param'];
        const outputParameter = config['to-param'];

        return inputs.map(input => {
            let outputValue = input[inputParameter];
            // read the data and create Graph

            createGraph();
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

Visualization()

exports.Visualization = Visualization;
