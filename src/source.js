import "./source.scss";
import "ol/ol.css";
import Map from "ol/Map";
import GeoJSON from "ol/format/GeoJSON";
import View from "ol/View";
import {
  defaults as defaultInteractions,
  DragRotateAndZoom
} from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import { OSM, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Stroke, Style, Fill, Text } from "ol/style";
import { transform } from "ol/proj";
import VectorLayer from "ol/layer/Vector";

// coordonnées récupérées depuis https://www.latlong.net/convert-address-to-lat-long.html
const nws = transform([1.06653, 49.42847], "EPSG:4326", "EPSG:3857");
const copeaux = transform([1.06539, 49.42251], "EPSG:4326", "EPSG:3857");

const geojsonObject = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "EPSG:3857"
    }
  },
  features: [
    {
      type: "Feature",
      properties: {
        name: "Normandie Web School"
      },
      geometry: {
        type: "Point",
        coordinates: nws
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Copeaux"
      },
      geometry: {
        type: "Point",
        coordinates: copeaux
      }
    }
  ]
};

const pointStyle = new Style({
  image: new CircleStyle({
    radius: 8,
    fill: new Fill({ color: "purple" }),
    stroke: new Stroke({ color: "purple", width: 1 })
  })
});

const pointHoverStyle = new Style({
  image: new CircleStyle({
    radius: 8,
    fill: new Fill({ color: "purple" }),
    stroke: new Stroke({ color: "purple", width: 1 })
  }),
  text: new Text({
    textAlign: "center",
    placement: "POINT",
    font: "bold 22",
    stroke: new Stroke({ color: "purple", width: 2 }),
    fill: new Fill({ color: "white" }),
    scale: 1.5
  })
});

const vectorPoints = new VectorLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(geojsonObject)
  }),
  style: pointStyle
});

var map = new Map({
  interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorPoints
  ],
  target: "carteNWS",
  view: new View({
    projection: "EPSG:3857",
    center: nws,
    zoom: 14
  })
});

const featureOverlay = new VectorLayer({
  source: new VectorSource(),
  map: map,
  style: feature => {
    pointHoverStyle.getText().setText(feature.get("name"));
    return pointHoverStyle;
  }
});

var highlight;
const displayFeatureInfo = pixel => {
  vectorPoints.getFeatures(pixel).then(features => {
    const feature = features.length ? features[0] : undefined;

    if (feature !== highlight) {
      if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
      }
      if (feature) {
        featureOverlay.getSource().addFeature(feature);
      }
      highlight = feature;
    }
  });
};

map.on("pointermove", e => {
  if (e.dragging) {
    return;
  }
  const pixel = map.getEventPixel(e.originalEvent);
  displayFeatureInfo(pixel);
});
