# Visualisation plugin

Visualisation plugin is a visualisation data product that helps analyse the carbon and cpu energy consumption of our servers.

### Usage

Visualization plugin requires:
- array containing carbon emission and energy usage data by the servers (required parameters are shown in the example below)
- output file path as config
![Blank diagram](https://github.com/ramgsuri/visualization-plugin/assets/31445077/d6036906-cd5e-4a95-9df8-9b67b3f9a2ec)


### A sample Report
![image](https://github.com/ramgsuri/visualization-plugin/assets/31445077/4abd486c-77db-4c2c-ba11-188bdc2befd7)


#### API usage

```
const visualization = Visualization();
const result = visualization.execute([
    {
      timestamp: '2024-03-05T00:00:00.000Z',
      name: 'server-1',
      'cpu/energy': 0.045017969268292685,
      'grid/carbon-intensity': 369.4212640011265,
      carbon: 16.63059510985655
    },
    {
      timestamp: '2024-03-05T00:00:00.000Z',
      name: 'server-2',
      'cpu/energy': 0.029579080198170734,
      'grid/carbon-intensity': 369.4212640011265,
      carbon: 10.927141194798923
    }
  ], {'output-path': './output.html'});
```

#### Manifest file

```
name: visualization
description: Simple demo of visualization plugin
tags:
initialize:
  plugins:
    visualization-plugin:
      method: Visualization
      path: "visualization-plugin-gsft"
tree:
  children:
    child:
      pipeline:
        - visualization-plugin
      inputs:
        - timestamp: '2024-03-05T00:00:00.000Z'
          name: 'server-1'
          cpu/energy: 0.045017969268292685
          grid/carbon-intensity: 369.4212640011265
          carbon: 16.63059510985655
        - timestamp: '2024-03-05T00:00:00.000Z'
          name: 'server-2'
          cpu/energy: 0.029579080198170734
          grid/carbon-intensity: 369.4212640011265
          carbon: 10.927141194798923
      config:
        visualization-plugin:
          output-path: ./examples/outputs/emission-report.html
```

#### Integration with existing plugins

Below is an example of generating data by the some plugins (mock-observations, watttime etc.) and feeding to the visualization plugin. The integration works fine as long as required parameters are passed down to the plugin.

Example:

    ...manifest file
    
    pipeline:
    - mock-observations
    - cloud-metadata
    - teads-curve
    - watttime
    - operational-carbon
    - visualization-plugin
	config:
        visualization-plugin:
          output-path: ./examples/outputs/emission-report.html


NOTE: If the `output-path` is not specified in the config, then it picks the default path of **'./examples/outputs/report.html'**

### Steps to run the plugin

```
npm i
npm link
```

#### then head over to if repo

```
npm link visualization-plugin-gsft
npm run ie -- --manifest ./examples/manifests/visualization-demo.yml --output ./examples/outputs/output.html
```

There is a demo manifest file provided at [examples/manifests/visualization-demo.yml](examples/manifests/visualization-demo.yml) to quickly get started.

Note: To be able to run the demo pipeline, some other plugins need to be installed.
```
npm i -g @grnsft/if-unofficial-plugins
```
