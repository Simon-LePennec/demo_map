$(document).ready(function(){
    $("#exampleModalCenter").modal('show');
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
            'fill-extrusion-color': '#aaa',
            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.8
            }
        }
    );

    //--//--//--//--//--//--//--//
    //--// CHILL SPOTS LIST //--//
    //--//--//--//--//--//--//--//

    var cool_places_list = [
        {
            name: "machu_picchu",
            coords: {
                zoom: 16.192662346761892,
                center: [-72.53702749232376,-13.15860866142934],
                pitch: 70.5,
                bearing: 60.67991456750246,
                essential: true
            },
            description: ""
        },
        {
            name: "lhassa",
            coords: {
                zoom: 16.753270218214084,
                center: [91.11682346371094, 29.657465313214885],
                pitch: 84.49999999999999,
                bearing: -0,
                essential: true
            },
            description: ""
        },
        {
            name: "uluru",
            coords: {
                zoom: 15.034958695808466,
                center: [131.03702418110242, -25.351250097990885],
                pitch: 84.99999999999997,
                bearing: -54.39999999999977,
                essential: true
            },
            description: ""
        },
        {
            "name": "pentagram",
            "coords": {
            "zoom": 16.25655094758078,
            "center": [
                62.185790353634275,
                52.47991822776581
            ],
            "pitch": 0,
            "bearing": 0,
            "essential": true
            },
            "description": ""
        }
    ];

    //--//--//--//--//-
    //--// FLY ! //--//
    //--//--//--//--//-

    document.getElementById('fly').addEventListener('click', function () {

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var random_int = getRandomInt(0,cool_places_list.length-1);

        //Condition to avoid getting same place two times in a row
        if (typeof old_value !== 'undefined') {
            if (old_value != random_int) {
                //do nothing
            } else {
                while (old_value == random_int) {
                    var random_int = getRandomInt(0,cool_places_list.length-1);
                }
            }
        } else {
            //do nothing
        }

        map.flyTo(cool_places_list[random_int].coords);

        old_value = random_int;

        $('#coordinates_div').collapse('hide')

    });

    document.getElementById('coordinates_button').addEventListener('click', function () {

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

        console.log(object_to_print)
        document.getElementById('coordinates_div_body').innerHTML = JSON.stringify(object_to_print);

    });
    
});