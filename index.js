import ol from 'planet-maps/dist/ol-base'

const format = new ol.format.GeoJSON();

const source = new ol.source.Vector({
  features: []
});

const map = new ol.Map({
  target: document.getElementById('map'),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        crossOrigin: 'anonymous',
        url: 'https://{a-d}.tiles.mapbox.com/v3/planet.he80d477/{z}/{x}/{y}.png'
      })
    }),
    new ol.layer.Vector({
      source: source,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(252,172,32,1)',
          width: 1.5
        }),
        fill: new ol.style.Fill({
          color: 'rgba(252,172,32,0.5)'
        }),
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: 'rgba(252,172,32,0.5)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(252,172,32,1)',
            width: 1.5
          })
        })
      })
    })
  ],
  view: new ol.View({
    center: [0, 0],
    zoom: 3
  })
});

fetch('http://eonet.sci.gsfc.nasa.gov/api/v2/events?days=20')
  .then(response => response.json())
  .then(data => {
    const features = data.events.map(event => {
      const json = {
        type: 'Feature',
        id: event.id,
        properties: {
          title: event.title,
          description: event.description,
          link: event.link
        },
        geometry: {
          type: 'GeometryCollection',
          geometries: event.geometries.map(geometry => {
            // TODO: file a ticket about the invalid polygon coordinates
            if (geometry.type === 'Polygon') {
              geometry.coordinates = [geometry.coordinates];
            }
            return geometry;
          })
        }
      };
      return format.readFeature(json, {featureProjection: 'EPSG:3857'});
    });
    source.addFeatures(features);
  });

const element = document.getElementById('overlay');

const overlay = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(overlay);

map.on('pointermove', function(event) {
  let feature = null;
  if (!event.dragging) {
    feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
  }
  if (feature) {
    map.getTarget().style.cursor = 'pointer';
    element.innerText = feature.get('title');
    element.style.visibility = 'visible';
    overlay.setPosition(event.coordinate);
  } else {
    element.style.visibility = 'hidden';
    map.getTarget().style.cursor = '';
  }
});

map.on('click', function(event) {
  const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
  if (feature) {
    window.open(feature.get('link'));
  }
});
