$(document).ready(function(){
    $("#StartingModalCenter").modal('show');
});

//--//--//--//--//--//--//--
//-- MAP INITIALISATION --//
//--//--//--//--//--//--//--

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtaXNvbCIsImEiOiJjamR2cXl3dzUwM3l0MnJvNnp5ZHlpczUwIn0.3pm6x8Nm9rsl0I7RML6zJw';
var map = new mapboxgl.Map({
    container: 'map',
    //BASE
    zoom: 13.1,
    center: [-114.34411, 32.6141],
    pitch: 85,
    bearing: 80,
    style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
});
// map.on('flystart', function(){
// 	flying = true;
// });
// map.on('flyend', function(){
// 	flying = false;
// });
 
map.on('load', function () {

    //START DEM 
    map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
    });

    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5  });
    
    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });
    //END DEM 

    map.addControl(new mapboxgl.NavigationControl());

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': 'white',
            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': 
                ["*", 1.5, ['get', 'height']]
            ,
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                1,
                15.1,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.9
            }
        }
    );

    
    //--//--//--//--//-
    //--// FLY ! //--//
    //--//--//--//--//-

    //Use a copy of mydata because we remove viewed location from the array on each 
    var mydata_copy = mydata.slice(0);

    document.getElementById('fly').addEventListener('click', function () {

        if (mydata_copy.length != 0) {

            //START get random data
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            var random_int = getRandomInt(0,mydata_copy.length-1);

            location_data = mydata_copy[random_int];
            //END get random data

            //Remove the location from mydata_copy to avoid getting it again
            mydata_copy.splice(random_int,1);

            //Fly to location
            map.flyTo(location_data.coords);
            //In order to check when flyto() has "arrived" (to display name & description)
            map.fire('flystart');

             //Hide coordinate & footer div
             $('#coordinates_div').collapse('hide')
             $("#footer").fadeOut("slow");
            
        } else {

            //Show ending modal
            $('#EndingModalCenter').modal('show');

            //And reset the data
            mydata_copy = mydata.slice(0);
            
        }

    });
}); //END map.on('load')


//START display name & description if exists
map.on('moveend', function(e){

    if (location_data.name != "" || location_data.description != "") {
        $("#footer").fadeIn("slow");
        document.getElementById('description').innerHTML =
            "<p><strong>"+ location_data.name +"</strong></p>"+
            "<p>"+ location_data.description +"</p>"
        //map.fire('flyend');
    } 
});
//END display name & description if exists


//START display coordinates
var element1 = document.getElementById('coordinates_button');
var element2 = document.getElementById('refresh')

document.addEventListener('click', event => {
    if (event.target !== element1 && event.target !== element2) {
        return
    }
    var _zoom = map.getZoom();
    var _center = [map.getCenter().lng,map.getCenter().lat];
    var _pitch = map.getPitch();
    var _bearing = map.getBearing();

    var temp = {
        zoom: _zoom,
        center: _center,
        pitch: _pitch,
        bearing: _bearing,
        essential: true
    }

    var object_to_print = {
        name: "",
        coords: temp,
        description: ""
    }

    document.getElementById('json').textContent = JSON.stringify(object_to_print, undefined, 2);    
});
//END display coordinates


//START copy to clipboard
document.getElementById('copy_to_clipboard').addEventListener('click', function () {
    /* Get the text field */
    var copyText = document.getElementById("json");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
});
//END copy to clipboard