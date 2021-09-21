
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
    var layer_name = e.layer.wmsParams.layers;

    if(this.options.layerName.indexOf(layer_name) != -1){
      console.log(layer_name);
      this.addTo(map);
    }
  },

  removeLegend : function(map, e){
    let is_target_layer = false;

    map.eachLayer(layer => {
      if(this.options.layerName.indexOf(layer.wmsParams.layers) != -1){
        console.log(layer)
        is_target_layer = true;
      }
    });

    if(!is_target_layer){
     map.removeControl(this);
    }
  }

});

L.control.legend = function(name, opts){
  return new L.Control.Legend(name, opts);
}; 

var leyenda_cosecha = L.control.legend('Leyenda-1', {
  layerName : ['cosechados_2000_2019_Corrientes', 'cosechados_2000_2019_Misiones'],
  imgURL : "https://geoforestal.magyp.gob.ar/geoserver/dpf/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=cosechados_2000_2019_Corrientes",
  position : "bottomright"
});

var leyenda_altura = L.control.legend('Leyenda-2', {
  layerName : ['altura_plantaciones_1', 'altura_plantaciones_2'],
  imgURL : "https://geoforestal.magyp.gob.ar/geoserver/dpf/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=altura_plantaciones_1",
  position : "bottomright"
});

export{leyenda_cosecha, leyenda_altura};