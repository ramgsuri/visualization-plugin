const fs = require('fs');
const ejs  = require('ejs');
const { barChartData, pieChartData } = require("./chartConfig");
const templatePath = 'chartTemplate.ejs';


const generateHTML = (carbonBarChart, cpuEnergyBarChart, carbonPieChart, startDate, endDate) => {
    fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
        console.error(err);
        return;
    }
 
    // Render the template with the provided data
    const html = ejs.render(template, { carbonBarChart, cpuEnergyBarChart, carbonPieChart, startDate, endDate });

    // Write the HTML content to a file
    fs.writeFile('chart.html', html, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('HTML file with chart has been created.');
    });
    });
};


const buildChartData = (timestamp, serverCarbonUtil) => {
    const carbonBarChart = JSON.parse(JSON.stringify(barChartData));
    const cpuEnergyBarChart = JSON.parse(JSON.stringify(barChartData));
    const carbonPieChart = JSON.parse(JSON.stringify(pieChartData));
    carbonBarChart.data.labels = timestamp;
    cpuEnergyBarChart.data.labels = timestamp;
    carbonPieChart.data.labels = Object.keys(serverCarbonUtil);
    carbonBarChart.options.plugins.title.text = "Carbon Emission vs time";
    cpuEnergyBarChart.options.plugins.title.text = "CPU energy vs time";
    
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
        const totalCarbonValue = serverCarbonUtil[serverData].carbon.reduce((totalCarbonVal, carbonVal) => totalCarbonVal+carbonVal);
        carbonPieChart.data.datasets[0].data.push(totalCarbonValue);
    });
    
    console.log("Final carbon bar chart object", carbonPieChart);

    return {
        carbonBarChart,
        cpuEnergyBarChart,
        carbonPieChart
    };
};


const generateChartMetaData = (chartCSVData) => {
    const timestamp = [];
    const serverCarbonUtil = {};

    chartCSVData.forEach(data => {
        if(!timestamp.includes(data.timestamp)){
            timestamp.push(data.timestamp); // gets labels
        }
        if(serverCarbonUtil[data.name]) { //emissions object per server 
            serverCarbonUtil[data.name].carbon.push(data['carbon']);
            serverCarbonUtil[data.name]['carbon-intensity'].push(data['grid/carbon-intensity']);
            serverCarbonUtil[data.name]['cpu-energy'].push(data['cpu/energy']);
        }else{
            serverCarbonUtil[data.name] = {
                    'carbon': [ data['carbon'] ],
                    'carbon-intensity': [ data['grid/carbon-intensity'] ],
                    'cpu-energy': [ data['cpu/energy'] ]
            };
        }
    });

    return {
        timestamp,
        serverCarbonUtil
    };
};

const execute = (chartCSVData) => {
    // validateData(chartCSVData);

    const { timestamp, serverCarbonUtil } = generateChartMetaData(chartCSVData);

    const { carbonBarChart, cpuEnergyBarChart, carbonPieChart } = buildChartData(timestamp, serverCarbonUtil);

    generateHTML(carbonBarChart, cpuEnergyBarChart, carbonPieChart, timestamp[0], timestamp.slice(-1)[0]);
};

const chartCSVData = [
    {
      timestamp: '2024-03-05T00:00:00.000Z',
      duration: 600,
      name: 'server-1',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 96,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.045017969268292685,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 369.4212640011265,
      carbon: 16.63059510985655
    },
    {
      timestamp: '2024-03-05T00:10:00.000Z',
      duration: 600,
      name: 'server-1',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 58,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.0359739043902439,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 407.7921958242564,
      carbon: 14.669877463669417
    },
    {
      timestamp: '2024-03-05T00:20:00.000Z',
      duration: 600,
      name: 'server-1',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 52,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.03432118829268293,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 479.4052101329338,
      carbon: 16.453756485465647
    },
    {
      timestamp: '2024-03-05T00:30:00.000Z',
      duration: 600,
      name: 'server-1',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 8,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.012714664390243904,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 641.5010905055567,
      carbon: 8.156471071753634
    },
    {
      timestamp: '2024-03-05T00:40:00.000Z',
      duration: 600,
      name: 'server-1',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 72,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.03953106878048781,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 866.5443264330968,
      carbon: 34.25542336956823
    },
    {
      timestamp: '2024-03-05T00:50:00.000Z',
      duration: 600,
      name: 'server-1',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 65,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.03779907393292682,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 1060.241360110065,
      carbon: 40.07614155754724
    },
    {
      timestamp: '2024-03-05T00:00:00.000Z',
      duration: 600,
      name: 'server-2',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 37,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.029579080198170734,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 369.4212640011265,
      carbon: 10.927141194798923
    },
    {
      timestamp: '2024-03-05T00:10:00.000Z',
      duration: 600,
      name: 'server-2',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 8,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.012714664390243904,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 407.7921958242564,
      carbon: 5.184940910866041
    },
    {
      timestamp: '2024-03-05T00:20:00.000Z',
      duration: 600,
      name: 'server-2',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 64,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.03754447463414634,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 479.4052101329338,
      carbon: 17.99901675131353
    },
    {
      timestamp: '2024-03-05T00:30:00.000Z',
      duration: 600,
      name: 'server-2',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 38,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.02994268390243902,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 641.5010905055567,
      carbon: 19.20826437607781
    },
    {
      timestamp: '2024-03-05T00:40:00.000Z',
      duration: 600,
      name: 'server-2',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 17,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.019587595746951215,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 866.5443264330968,
      carbon: 16.973519962985634
    },
    {
      timestamp: '2024-03-05T00:50:00.000Z',
      duration: 600,
      name: 'server-2',
      'cloud/instance-type': 'Standard_E64_v3',
      'cloud/region': 'westus3',
      'cloud/vendor': 'azure',
      'cpu/utilization': 62,
      'vcpus-allocated': 64,
      'vcpus-total': 64,
      'memory-available': 432,
      'physical-processor': 'Intel® Xeon® Platinum 8370C,Intel® Xeon® Platinum 8272CL,Intel® Xeon® 8171M 2.1 GHz,Intel® Xeon® E5-2673 v4 2.3 GHz',
      'cpu/thermal-design-power': 270,
      'cloud/region-cfe': 'CAISO',
      'cloud/region-em-zone-id': 'US-CAL-CISO',
      'cloud/region-wt-id': 'CAISO_NORTH',
      'cloud/region-location': 'US West (N. California)',
      'cloud/region-geolocation': '34.0497,-118.1326',
      'cpu/energy': 0.03702935414634147,
      geolocation: '34.0497,-118.1326',
      'grid/carbon-intensity': 1060.241360110065,
      carbon: 39.26005280411435
    }
  ];

  execute(chartCSVData);
