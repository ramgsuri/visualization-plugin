const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const { barChartData, pieChartData } = require("./chartConfig");
const CHART_TEMPLATE_PATH = path.resolve(__dirname, './chartTemplate.ejs');
const REPORT_OUTPUT_PATH = './examples/outputs/report.html';

const generateHTML = (carbonBarChart, cpuEnergyBarChart, carbonPieChart, startDate, endDate, reportOutputPath) => {
    fs.readFile(CHART_TEMPLATE_PATH, 'utf8', (err, template) => {
        if (err) {
            console.error(err);
            return;
        }

        const html = ejs.render(template, { carbonBarChart, cpuEnergyBarChart, carbonPieChart, startDate, endDate });

        fs.writeFile(reportOutputPath, html, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Emissions Report generated successfully.');
        });
    });
};

const buildCharts = (timestamps, carbonEnergyDataPerServer) => {
    const carbonBarChart = JSON.parse(JSON.stringify(barChartData));
    const cpuEnergyBarChart = JSON.parse(JSON.stringify(barChartData));
    const carbonPieChart = JSON.parse(JSON.stringify(pieChartData));
    carbonBarChart.data.labels = timestamps;
    cpuEnergyBarChart.data.labels = timestamps;
    carbonPieChart.data.labels = Object.keys(carbonEnergyDataPerServer);
    carbonBarChart.options.plugins.title.text = "Carbon Emission vs time";
    cpuEnergyBarChart.options.plugins.title.text = "CPU energy vs time";

    Object.keys(carbonEnergyDataPerServer).forEach(serverName => {
        carbonBarChart.data.datasets.push({
            label: serverName,
            data: carbonEnergyDataPerServer[serverName]['carbon'],
            borderWidth: 1
        });
        cpuEnergyBarChart.data.datasets.push({
            label: serverName,
            data: carbonEnergyDataPerServer[serverName]['cpu-energy'],
            borderWidth: 1
        });
        const totalCarbonValue = carbonEnergyDataPerServer[serverName].carbon.reduce((totalCarbonVal, carbonVal) => totalCarbonVal + carbonVal);
        carbonPieChart.data.datasets[0].data.push(totalCarbonValue);
    });

    return {
        carbonBarChart,
        cpuEnergyBarChart,
        carbonPieChart
    };
};

const generateChartMetaData = (serversData) => {
    const timestamps = [];
    const carbonEnergyDataPerServer = {};

    serversData.forEach(serverData => {
        if (!timestamps.includes(serverData.timestamp)) {
            timestamps.push(serverData.timestamp); // gets labels
        }

        if (!carbonEnergyDataPerServer[serverData.name]) {
            carbonEnergyDataPerServer[serverData.name] = {
                'carbon': [],
                'carbon-intensity': [],
                'cpu-energy': []
            };
        }
        //emissions object per server
        carbonEnergyDataPerServer[serverData.name]['carbon'].push(serverData['carbon'] || 0);
        carbonEnergyDataPerServer[serverData.name]['carbon-intensity'].push(serverData['grid/carbon-intensity'] || 0);
        carbonEnergyDataPerServer[serverData.name]['cpu-energy'].push(serverData['cpu/energy'] || 0);
    });

    return {
        timestamps,
        carbonEnergyDataPerServer
    };
};

const Visualization = (globalConfig) => {
    console.log("Global config:", globalConfig);
    const metadata = {
        kind: 'execute',
    };

    const execute = async (inputs, config) => {
        const outputPath = config['output-path'] || REPORT_OUTPUT_PATH;
        const { timestamps, carbonEnergyDataPerServer } = generateChartMetaData(inputs);

        const { carbonBarChart, cpuEnergyBarChart, carbonPieChart } = buildCharts(timestamps, carbonEnergyDataPerServer);

        generateHTML(carbonBarChart, cpuEnergyBarChart, carbonPieChart, timestamps[0], timestamps.slice(-1)[0], outputPath);

        return inputs;
    };

    return {
        metadata,
        execute,
    };
};

exports.Visualization = Visualization;
