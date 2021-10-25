import {baseTreeLayersWithInfo, baseLayersTree, baseTreeMap} from "./layers.js";
import {addAreasQuemadas, addSentinelConcordia} from "./geotiff_layers.js";


var init_lat = -34.67072293081609,
    init_long = -58.35927735877256;

export var map = new L.map('mapid', {
    layers : baseTreeMap[0]["children"][1].layer
}).
setView([init_lat, init_long], 5);

// Este plugin esta bueno para los controles: https://github.com/jjimenezshaw/Leaflet.Control.Layers.Tree
L.control.layers.tree(baseTreeMap, baseLayersTree).addTo(map); 
//L.control.layers.tree(baseTreeLayersWithInfo).addTo(map);
export var geotiffControl = L.control.layers().addTo(map);

L.control.coordinates({
    position:"bottomleft",
    decimals: 2,
    decimalSeperator:",",
    labelTemplateLat:"Latitude: {y}",
    labelTemplateLng:"Longitude: {x}"
}).addTo(map);
  
map.createPane('geotif-pane');
map.getPane('geotif-pane').style.zIndex = 650;
  
// Agrego la imagen tif al mapa, el problema es que carga despues de haber cargado toda la pagina. Habria que colocar un spinner mientras carga.
addAreasQuemadas;
addSentinelConcordia;

// Limitar el zoom maximo cuando hay una capa tiff activa!
// Limitar el acceso a las imagenes por usuario.
