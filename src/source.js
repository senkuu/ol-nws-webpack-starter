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
        name: "copeaux",
        coordinates: copeaux
      }
    }
  ]
};

const getText = (feature, resolution) => {
  const text = feature.get("name");
  return text;
};

const createTextStyle = (feature, resolution) =>
  new Text({
    textAlign: "center",
    text: getText(feature, resolution),
    placement: "POINT",
    font: "bold 18",
    fill: new Fill({ color: "black" })
  });

const pointStyleFunction = (feature, resolution) =>
  new Style({
    image: new CircleStyle({
      radius: 8,
      fill: new Fill({ color: "purple" }),
      stroke: new Stroke({ color: "purple", width: 1 })
    }),
    text: createTextStyle(feature, resolution)
  });

const vectorPoints = new VectorLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(geojsonObject)
  }),
  style: pointStyleFunction
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
