import {map, sidebar} from "./main.js";
import {leyenda_cosecha, leyenda_altura, leyenda3, leyenda4, leyenda5} from "./legends.js";
import { content as content} from "../assets/info-content.js";

/* Evento para agregar leyenda */
/* ---------------------------- */

map.on('overlayadd', (e) => {
  //console.log(e);
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

map.on('baselayerchange', (e) => {
  let div = document.getElementById('base-layer-info-content');
  let argenmap = `
  Argenmap mapa base es un servicio libre y gratuito de mapas base desarrollado por el Instituto Geográfico Nacional para que los diferentes usuarios puedan embeber el mapa digital oficial de la República Argentina en sitios web o consumirlo desde una aplicación SIG. Este servicio se enmarca en el mandato de la Ley Nº 22.963 (Ley de la Carta)
  `;
  let world_cover_2020 = `
  
  ESA WorldCover 10 m 2020 proporciona un nuevo producto de cobertura terrestre global de referencia con una resolución de 10 m para 2020 basado en datos de Sentinel-1 y 2. <a target="_blank" href = "https://worldcover2020.esa.int/"> Referencias </a> y <a target="_blank" href = "https://worldcover2020.esa.int/viewer"> Viewer </a>
  

  `;

  let layers = { 
    // El indice es segun el orden en el que estan las capas base en el 
    // menu control
    '0' : 'TopoMap-OSM',
    '1' : argenmap,
    '2' : 'SRTM30-Colored',
    '3' : world_cover_2020,
    '4' : 'World Cover 2020 Sentinel-2',
    '5' : 'World Cover 2020 Sentinel- 1 VV/HH',
    '6' : 'Google Hybrid'
  };

  div.innerHTML = ` 
  
  <p>
  <i>
  Las capas base pueden ser utilizadas para contextualizar el resto de la información seleccionada. 
  </i>
  </p>
  <tr>
  <p>
    ${layers[e.name] }
  </p>

  `
});

// Para leer: http://132.72.155.230:3838/js/leaflet.html
