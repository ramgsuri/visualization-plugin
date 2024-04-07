# Visualisation plugin

Visualisation plugin is a visualisation data product that helps analyse the carbon and cpu energy consumption of our servers.

This plugin can be plugged at any stage in a pipeline but needs 3 specific data points for the visualisation purpose.


### Input data

```
[
    
    {
        timestamp: '2024-03-05T00:00:00.000Z',

        name: 'server-1',

        'cpu/energy': 0.045017969268292685,

        'grid/carbon-intensity': 369.4212640011265,

        carbon: 16.63059510985655
    },
    
]
```

### How to feed data to report
The visualization plugin takes in an array containing carbon emission and cpu energy consumption data. For the demo, we are generating data by the 'mock-observations' plugin and feeding to the visualization plugin.

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
