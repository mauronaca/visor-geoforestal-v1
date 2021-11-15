import {map, sidebar} from "./main.js";
import {leyenda_cosecha, leyenda_altura, leyenda3, leyenda4, leyenda5} from "./legends.js";
import { content as content} from "../assets/info-content.js";

/* Evento para agregar leyenda */
/* ---------------------------- */

map.on('overlayadd', (e) => {
  console.log(e);
  leyenda_altura.addLegend(map, e);
  leyenda_cosecha.addLegend(map, e);
  leyenda3.addLegend(map, e);
  leyenda4.addLegend(map, e);
  leyenda5.addLegend(map, e);
  //leyenda6.addLegend(map, e);
  //leyenda7.addLegend(map, e);
});

map.on('overlayremove', (e) => {
  console.log(e)
  leyenda_altura.removeLegend(map, e);
  leyenda_cosecha.removeLegend(map, e);
  leyenda3.removeLegend(map, e);
  leyenda4.removeLegend(map, e);
  leyenda5.removeLegend(map, e);
  //leyenda6.removeLegend(map, e);
  //leyenda7.removeLegend(map, e);
});

/* Botones de informacion en las etiquetas de las capas */

window.layerInfoClick = function (contentText){
  // Abrir menu
  // Abrir el tab de Info
  if (L.DomUtil.hasClass(sidebar._sidebar, 'collapsed')) {
    L.DomUtil.removeClass(sidebar._sidebar, 'collapsed'); // Abrir el menu
    document.getElementById('information').className = 'sidebar-pane active'; // Mostrar el pane especifico
    let p = content(contentText);
    document.getElementById('information').appendChild(p);
    
  } else {
    L.DomUtil.addClass(sidebar._sidebar, 'collapsed'); // Cerrar el menu
    document.getElementById("information-content-text").remove();
  }
}

/*
// Para leer: http://132.72.155.230:3838/js/leaflet.html
let legend = L.control({
  position : "bottomright",
  //pane : 'legend-pane'
});
legend.onAdd = function(){
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML = 
  `<img src="https://geoforestal.magyp.gob.ar/geoserver/dpf/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=altura_plantaciones_1">`;
  return div;
}
// Cuando se agrega una capa
map.on('overlayadd', (e) => {
  //let target_layer_1 = "elev_2021-03-06_t1100_1629683372509_macizos_concordia";
  let target_layer_2 = "altura_plantaciones_" + "1";
  let target_layer_3 = "altura_plantaciones_" + "2";

  try{
    let wms_layer_name = e.layer.wmsParams.layers;
    if(wms_layer_name == target_layer_2 || wms_layer_name == target_layer_3){
      legend.addTo(map);
    }
  } catch(error) {
    console.log(error);
  }
  
});

map.on('overlayremove', (e) => {
  let is_target_layer = false;
  //let target_layer_1 = "elev_2021-03-06_t1100_1629683372509_macizos_concordia";
  let target_layer_2 = "altura_plantaciones_" + "1";
  let target_layer_3 = "altura_plantaciones_" + "2";

  map.eachLayer( (ly) => {
    try {
      let wms_layer_name = ly.wmsParams.layers;
      if(wms_layer_name == target_layer_2 || wms_layer_name == target_layer_3){
        is_target_layer = true;
      } 
    } 
    catch(error) {
      console.log(error);
    }
  });

  if(!is_target_layer){
    map.removeControl(legend);
  }
});
*/