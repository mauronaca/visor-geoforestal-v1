import {map} from "./main.js";

/* Evento para agregar leyenda */
/* ---------------------------- */
// Para leer: http://132.72.155.230:3838/js/leaflet.html
let legend = L.control({
  position : "bottomright",
  //pane : 'legend-pane'
});
legend.onAdd = function(){
  /* Si ya esta definido, return nada(?) */
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML = 
  `<img src="https://geoforestal.magyp.gob.ar/geoserver/dpf/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=altura_plantaciones_1">`;
  return div;
}
// Cuando se agrega una capa
map.on('overlayadd', (e) => {
  let wms_layer_name = e.layer.wmsParams.layers;
  let target_layer_1 = "elev_2021-03-06_t1100_1629683372509_macizos_concordia";
  let target_layer_2 = "altura_plantaciones_" + "1";
  let target_layer_3 = "altura_plantaciones_" + "2";

  /* Preguntar si el control ya esta definido! hee */

  if(wms_layer_name == target_layer_1 || wms_layer_name == target_layer_2 || wms_layer_name == target_layer_3){
    legend.addTo(map);
  }
});

map.on('overlayremove', (e) => {
  let is_target_layer = false;
  let target_layer_1 = "elev_2021-03-06_t1100_1629683372509_macizos_concordia";
  let target_layer_2 = "altura_plantaciones_" + "1";
  let target_layer_3 = "altura_plantaciones_" + "2";

  map.eachLayer( (ly) => {
    let wms_layer_name = ly.wmsParams.layers;
    if(wms_layer_name == target_layer_1 || wms_layer_name == target_layer_2 || wms_layer_name == target_layer_3){
      is_target_layer = true;
    }
  });

  if(!is_target_layer){
    map.removeControl(legend);
  }
});