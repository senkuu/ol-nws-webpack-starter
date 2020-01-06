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
import { Circle as CircleStyle, Stroke, Style, Fill } from "ol/style";
import { transform } from "ol/proj";
import VectorLayer from "ol/layer/Vector";

// coordonnées récupérées depuis https://www.latlong.net/convert-address-to-lat-long.html
const nws = transform([1.06653, 49.42847], "EPSG:4326", "EPSG:3857");
const copeaux = transform([1.06539, 49.42251], "EPSG:4326", "EPSG:3857");

const image = new CircleStyle({
  radius: 5,
  fill: new Fill({ color: "purple" }),
  stroke: new Stroke({ color: "purple", width: 1 })
});

const styles = {
  Point: new Style({ image: image })
};

const styleFunction = feature => styles[feature.getGeometry().getType()];

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
      geometry: {
        type: "Point",
        coordinates: nws
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: copeaux
      }
    }
  ]
};

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonObject)
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction
});

var map = new Map({
  interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  target: "carteNWS",
  view: new View({
    projection: "EPSG:3857",
    center: nws,
    zoom: 14
  })
});
