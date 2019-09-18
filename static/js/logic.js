const url= 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

const url1= 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

// Create a map object
// const myMap = L.map("map", {
//     center: [37.09, -95.71],
//     zoom: 5
//   });
  
  // L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  //   attribution: attribution,
  //   maxZoom: 18,
  //   id: "mapbox.streets-basic",
  //   accessToken: API_KEY
  // }).addTo(myMap);
  
  //console.log("Inside function 1111 ")

  d3.json(url).then(function(data) {
    console.log("Inside function 1 ")
    createFeatures(data.features); 
});


function createFeatures(earthquakeData) {

  console.log("Inside function 1 ")
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h5>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
      "</h5><p>" + new Date(feature.properties.time) + "</p>");
    },
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: feature.properties.mag*30000,
          fillColor: getColor(feature.properties.mag),
          color: "#000",
          weight: .5,
          fillOpacity: .5,
          stroke: true
      })
    }
  });
  createMap(earthquakes) // Send earthquakes layer to the createMap function
}


function createMap(earthquakes) {

  console.log("Inside function 1 ")
  
  // Various Map Layers (Mapbox API) for user selection
  // var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
  //   "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");

  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    })

    var outdoorMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: attribution,
      maxZoom: 18,
      id: "mapbox.streets-basic",
      accessToken: API_KEY
      })
  

      var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: attribution,
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
        })
   

  //   var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  //   "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");
  // var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  //   "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");


  // BaseMaps that users can select
  var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": lightMap,
    "Outdoors": outdoorMap
  };

  console.log("Inside function 2 ")
  // Add a tectonic plate layer
  var tectonicPlates = new L.LayerGroup();

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [satelliteMap, earthquakes, tectonicPlates]
  });

  //d3.json(url).then(function(data) {

  d3.json(url1).then(function(plateData) {
    // Adding our geoJSON data, along with style information, to the tectonicplates
    // layer.
    L.geoJson(plateData, {
      color: "orange",
      weight: 2
    })
    .addTo(tectonicPlates);
  });



  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {

      
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    console.log(div.innerHTML)
    return div;
  };
  legend.addTo(myMap);
}

function getColor(d) {
  return d > 5 ? '#F30' :
  d > 4  ? '#F60' :
  d > 3  ? '#F90' :
  d > 2  ? '#FC0' :
  d > 1   ? '#FF0' :
            '#9F3';
}

