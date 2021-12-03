
L.Control.Legend = L.Control.extend({
  options : {
    layerName : '',
    imgURL : ''
  },

  initialize : function(name, opts) {
    this._name = name;
    this._className = 'legend-' + 'name';
    L.setOptions(this, opts);
  },

  onAdd : function(map){
    var img = L.DomUtil.create('img', this._className);
    img.src = this.options.imgURL;

    return img;
  },

  onRemove : function(map){
  },

  addLegend : function(map, e){
    $('.leaflet-container').css('cursor', 'progress');
    
    try {

      let layer_name;
      let layer_name_noWms;

      try{
        layer_name = e.layer.wmsParams.layers;
      } catch{

      }
      try{
        layer_name_noWms = e.layer._name;
      } catch{

      }
      if(this.options.layerName.indexOf(layer_name) != -1 || this.options.layerName.indexOf(layer_name_noWms) != -1){
        this.addTo(map);
      }
    } 
    catch(error) {
      //console.log(error);
    }
    $('.leaflet-container').css('cursor', '-webkit-grab');
  },

  removeLegend : function(map, e){
    try{
      let is_target_layer = false;

      let layer_name;
      let layer_name_noWms;

      try{
        layer_name = e.layer.wmsParams.layers;
      } catch{

      }
      try{
        layer_name_noWms = e.layer._name;
      } catch{

      }

      console.log(layer_name_noWms);
      console.log(this.options.layerName);
      map.eachLayer(layer => {
        //console.log(layer.wmsParams.layers)
        //console.log(`\n\nCapas que tiene que ser borrada: ${this.options.layerName}\n\n Capa que se esta procesando: ${layer.wmsParams.layers}`);
        if(this.options.layerName.indexOf(layer_name) != -1 &&this.options.layerName.indexOf(layer_name_noWms) != -1 ){
          is_target_layer = true;
        }
      });
      if(!is_target_layer){
        console.log('removing legendd')
        map.removeControl(this);
      }
    }
    catch(error) {
      console.log(error);
    }
  }
});

L.control.legend = function(name, opts){
  return new L.Control.Legend(name, opts);
}; 

/* Creacion de capas */

var leyenda_cosecha = L.control.legend('Leyenda-1', {
  layerName : ['cosechados_2000_2019_Corrientes', 'cosechados_2000_2019_Misiones', 'cosechados_2000_2019_Entre_Rios'],
  imgURL : "../images/cosechados.png",
  position : "topright"
});
var leyenda_altura = L.control.legend('Leyenda-2', {
  layerName : ['altura_plantaciones_1', 'altura_plantaciones_2'],
  imgURL : "https://geoforestal.magyp.gob.ar/geoserver/dpf/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=altura_plantaciones_1",
  position : "topright"
});
var leyenda3  = L.control.legend('Leyenda-3', {
  layerName : ['dpf:mapa_de_cambios_corrientes'],
  imgURL : "../images/mapa_de_cambios_corrientes.png",
  position : "topright"
});
var leyenda4  = L.control.legend('Leyenda-4', {
  layerName : ['icesat_entre_rios_2021', 'icesat_misiones_2021', 'icesat_corrientes_2021','icesat_delta_2021', 'icesat_chubut_2021','icesat_salta_2021', 'icesat_tucuman_2021', 'icesat_cordoba_2021',  'icesat_rio_negro_2021', 'icesat_neuquen_2021'],
  imgURL : "../images/icesat_legend.png",
  position : "bottomright"
});
var leyenda5  = L.control.legend('Leyenda-5', {
  layerName : ['dpf:macizos_forestales_publicacion_con_formato'],
  imgURL : "https://geoforestal.magyp.gob.ar/geoserver/dpf/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=macizos_forestales_publicacion_con_formato",
  position : "bottomright"
});
/*
var leyenda6  = L.control.legend('Leyenda-6', {
  layerName : ['icesat_misiones_2021'],
  imgURL : "https://geoforestal.magyp.gob.ar/geoserver/dpf/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=icesat_misiones_2021",
  position : "bottomright"
});
var leyenda7  = L.control.legend('Leyenda-7', {
  layerName : ['icesat_corrientes_2021'],
  imgURL : "https://geoforestal.magyp.gob.ar/geoserver/dpf/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=icesat_corrientes_2021",
  position : "bottomright"
});
*/

export{leyenda_cosecha, leyenda_altura, leyenda3, leyenda4, leyenda5};