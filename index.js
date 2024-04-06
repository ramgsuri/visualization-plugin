const fs = require('fs')
const ejs  = require('ejs')
const path = require('path')
const { barChartData, pieChartData } = require("./chartConfig")
const CHART_TEMPLATE_PATH = path.resolve(__dirname, './chartTemplate.ejs');
const REPORT_OUTPUT_PATH = './examples/outputs/report.html'

const generateHTML = (carbonBarChart, cpuEnergyBarChart, carbonPieChart, startDate, endDate, outputPath) => {
    fs.readFile(CHART_TEMPLATE_PATH, 'utf8', (err, template) => {
    if (err) {
        console.error(err);
        return;
    }
 
    const html = ejs.render(template, { carbonBarChart, cpuEnergyBarChart, carbonPieChart, startDate, endDate });

    const reportOutputPath = outputPath?outputPath:REPORT_OUTPUT_PATH
    fs.writeFile(reportOutputPath, html, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Emissions Report generated successfully.');
    });
    })
}

const buildCharts = (timestamp, serverCarbonUtil) => {
    const carbonBarChart = JSON.parse(JSON.stringify(barChartData));
    const cpuEnergyBarChart = JSON.parse(JSON.stringify(barChartData));
    const carbonPieChart = JSON.parse(JSON.stringify(pieChartData));
    carbonBarChart.data.labels = timestamp;
    cpuEnergyBarChart.data.labels = timestamp;
    carbonPieChart.data.labels = Object.keys(serverCarbonUtil);
    carbonBarChart.options.plugins.title.text = "Carbon Emission vs time"
    cpuEnergyBarChart.options.plugins.title.text = "CPU energy vs time"
    
    Object.keys(serverCarbonUtil).forEach(serverData => {
        carbonBarChart.data.datasets.push({
            label: serverData,
            data: serverCarbonUtil[serverData].carbon,
            borderWidth: 1
        });
        cpuEnergyBarChart.data.datasets.push({
            label: serverData,
            data: serverCarbonUtil[serverData]['cpu-energy'],
            borderWidth: 1 
        });
        let totalCarbonValue = serverCarbonUtil[serverData].carbon.reduce((totalCarbonVal, carbonVal) => totalCarbonVal+carbonVal);
        carbonPieChart.data.datasets[0].data.push(totalCarbonValue)
    });
    
    return {
        carbonBarChart,
        cpuEnergyBarChart,
        carbonPieChart
    }
}

const generateChartMetaData = (chartCSVData) => {
    const timestamp = [];
    const serverCarbonUtil = {};

    chartCSVData.forEach(data => {
        if(!timestamp.includes(data.timestamp)){
            timestamp.push(data.timestamp); // gets labels
        }
        if(serverCarbonUtil[data.name]) { //emissions object per server 
            serverCarbonUtil[data.name].carbon.push(data['carbon']?data['carbon']:0);
            serverCarbonUtil[data.name]['carbon-intensity'].push(data['grid/carbon-intensity']?data['grid/carbon-intensity']:0);
            serverCarbonUtil[data.name]['cpu-energy'].push(data['cpu/energy']?data['cpu/energy']:0);
        }else{
            serverCarbonUtil[data.name] = {
                    'carbon': [ data['carbon']?data['carbon']:0 ],
                    'carbon-intensity': [ data['grid/carbon-intensity']?data['grid/carbon-intensity']:0 ],
                    'cpu-energy': [ data['cpu/energy']?data['cpu/energy']:0 ]
            };
        }
    })

    return {
        timestamp,
        serverCarbonUtil
    }
}

const Visualization = (globalConfig) => {
    const metadata = {
        kind: 'execute',
    };

    const execute = async (inputs, config) => {
        const outputPath = config['output-path'];
        const { timestamp, serverCarbonUtil } = generateChartMetaData(inputs);

        const { carbonBarChart, cpuEnergyBarChart, carbonPieChart } = buildCharts(timestamp, serverCarbonUtil);
    
        generateHTML(carbonBarChart, cpuEnergyBarChart, carbonPieChart, startDate = timestamp[0], endDate = timestamp.slice(-1)[0], outputPath);

        return inputs;
    };

    return {
        metadata,
        execute,
    };
};

Visualization()

exports.Visualization = Visualization;
