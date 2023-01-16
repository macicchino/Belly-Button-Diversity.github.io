console.log("Proof were in js")

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}
console.log("Line34");

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
console.log("Made it to buildCharts")
// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    
    // Deliverable 1: 3. Create a variable that holds the samples array. 
    ///MC ADDITION
    var samples = data.samples;
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    ///MC ADDITION
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
    console.group(filteredSamples);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    ///MC ADDITION
    var metadata = data.metadata;
    var filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    ///MC ADDITION
    var chart1 = filteredSamples[0];
    console.log(chart1);
    console.log("Made it to line 82 - chart 1");
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    ///MC ADDITION
    var meta1 = filteredMeta[0];
    console.log(meta1)

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    ///MC ADDITION
    console.log(meta1);
    var otu_ids = chart1.otu_ids;
    var otu_labels = chart1.otu_labels;
    var sample_values = chart1.sample_values;
    //console.log(otu_ids);
    //console.log(otu_labels);
    //console.log(sample_values);
    console.log("Made it to line 99");

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    ///MC ADDITION
    var wfreq = data.metadata.map(person => person.wfreq);
    console.log(wfreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    ///MC ADDITION
    var yticks = otu_ids.slice(0,10).map(otulD => `OTU ${otulD}`).reverse();
    console.log(yticks);
    console.log("Line 109, yticks");

    // Deliverable 1: 8. Create the trace for the bar chart. 
    ///MC ADDITION
    var barData = [{
      y: yticks,
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation:"h",
    }
    ];
    console.log(barData)

    // Deliverable 1: 9. Create the layout for the bar chart. 
    ///MC ADDITION
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b> <br> (Bar Chart)",
      height: 380,
      width: 450
    };

    console.log(barLayout);
    console.log("Line 132 - End of Bar Chart build before construct");
    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    ///MC ADDITION
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    ///MC ADDITION
    var bubbleTrace = [
      {
      x: otu_ids.slice(0,85).reverse(),
      y: sample_values.slice(0,85).reverse(),
      text: otu_labels.slice(0,85).reverse(),
      mode: 'markers',
      marker: {
        color: otu_ids.slice(0,85).reverse(),
        size: sample_values.slice(0,85).reverse()
      }
    }
    ];

    console.log("Check BubbleData array below: ")
    console.log(bubbleTrace)

    // Deliverable 2: 2. Create the layout for the bubble chart.
    ///MC ADDITION
    var bubbleLayout = {
      title: "<b>Bacteria Cultures per Sample</b> <br> (Bubble Chart)",
      xaxis: { title: "OTU ID"},
      showlegend: false,
      height: 600,
      width: 1180
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    ///MC ADDITION
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

    // Deliverable 3: 4. Create the trace for the gauge chart.
    ///MC ADDITION
    var gaugeData = [ 
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: meta1.wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range:[null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "darkgreen" }
          ],
        }
      }
    ];

    console.log(gaugeData)
    // Deliverable 3: 5. Create the layout for the gauge chart.
    ///MC ADDITION
    var gaugeLayout = { width: 500, height: 380, margin: { t: 0, b: 0 } };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    ///MC ADDITION
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

});

};
