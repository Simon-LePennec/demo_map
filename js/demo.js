//--//--//--//--//--//--//--
//-- MAP INITIALISATION --//
//--//--//--//--//--//--//--


mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtaXNvbCIsImEiOiJjamR2cXl3dzUwM3l0MnJvNnp5ZHlpczUwIn0.3pm6x8Nm9rsl0I7RML6zJw';
var map = new mapboxgl.Map({
container: 'map',
zoom: 13.1,
center: [-114.34411, 32.6141],
pitch: 85,
bearing: 80,
style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
});
 
map.on('load', function () {

    map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
    });

    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    
    // add a sky layer that will show when the map is highly pitched
    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });

    map.addControl(new mapboxgl.NavigationControl());

});