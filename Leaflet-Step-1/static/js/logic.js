//Define geoJson data for 7 days 
var geoJson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Retrieve the GeoJson dataset
d3.json(geoJson).then(createMarkers);


function createMarkers(response) {

    // Pull the "Features" property from response.
    var earthquakes = response.features;

    //Initialize an array to hold Earthquake markers
    var earthquake_markers = [];

    // Loop through the Features array
    earthquakes.forEach(element => {
        var earthquake_marker = L.circleMarker([element.geometry.coordinates[1], element.geometry.coordinates[0]], {
            color: "black",
            fillColor: chooseColor(element.geometry.coordinates[2]),
            fillOpacity: 0.9,
            radius: element.properties.mag * 3
        }).bindPopup("<b>Location: </b>" + element.properties.place + "<br>" + "<b>Magnitude: </b>" + element.properties.mag + "<br>" + "<b>Depth: </b>" + element.geometry.coordinates[2] + "<br>" + "<b>Time: </b>" + new Date(element.properties.time));
        
        // Add coordinates to the markers array
        earthquake_markers.push(earthquake_marker);

        
    });

    // Create a layer group that's made from the earthquakemarkers array, and pass it to the createMap function
    createMap(L.layerGroup(earthquake_markers));

}

function chooseColor(depth){
    if (depth > 80) return "Red";
    else if (depth > 60) return "Orange";
    else if (depth > 40) return "Gold";
    else if (depth > 20) return "Yellow";
    else return "Green";
}



function createMap(earthquake_markers) {

    // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquake_markers
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquake_markers]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
   L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);


//    // Set up map legend
//    var legend = L.control({position: "bottomright"});

//    legend.onAdd = function() {
//      var div = L.DomUtil.create("div", "info legend"),
//       depth = [0, 20, 40, 60, 80];
      
//       div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  
//       for (var i =0; i < depth.length; i++) {
//         div.innerHTML += 
//         '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
//             depth[i] + (depth[i + 1] ? '-' + depth[i + 1] + '<br>' : '+');
//         }
//         return div;
//     };

//     // Add legend to map
//     legend.addTo(map);
}

