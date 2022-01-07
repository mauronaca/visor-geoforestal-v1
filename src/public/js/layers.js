import {map, geotiffControl} from './main.js';

// Extension de la clase L.WMS.Source que maneja el pedido de getFeatureInfo() y crea un popup en base a la informacion retornada.
function addFeatureInfoPopup(info, latlng){
  var popup = new L.popup({
    closeOnClick : false,
    autoClose : false
    });
  info = info.replace(/\n/g, "<br />");
  let stacked_text = `<div>${info}</div>`; // Texto que se irá acumulando en el popup
  
  map.eachLayer(function(layer) {
    if(layer._latlng == latlng){
      stacked_text = `${stacked_text}<br/><br/>${layer._content}`;
      layer.options['autoClose'] = true; // Cuando aparezca el nuevo popup, el popup anterior en la misma posicion desaparece
      layer.closePoup();
    }
  });
  popup.setContent(stacked_text);
  popup.setLatLng(latlng);
  popup.openOn(map);
}

function getFeatureInfoBody(url){
  return fetch('./getFeatureInfo', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify(url)
  })
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    return response.answer;
  });
}

var MySource = L.WMS.Source.extend({
    'showFeatureInfo' : function(latlng, info){
      $('.leaflet-container').css('cursor', 'progress');

      if(!this._map){
        $('.leaflet-container').css('cursor','-webkit-grab');
        return;
      }
      console.log(info);
      try{
        if(info[0] != '<'){
          // Si no me devuelve un iframe y efectivamente es el texto
          if(info != 'no features were found\n\r' && info != 'no features were found\n' && info != "no features were found\r\n") {
            // Si el feature es util se abre el popup
            addFeatureInfoPopup(info, latlng);
          }
          // Termino de abrir el popup
          //$('.leaflet-container').css('cursor', 'grab');
        } else {
          // Si el response info es un iframe, quiere decir que el origen cruzado no esta habilitado
          //console.log('Info en formato iframe');
          //* Completar */
          var json_url = {url : info.slice(info.indexOf("'") + 1, info.indexOf("' style='border:none'"))}; 

          getFeatureInfoBody(json_url).then((res) => {
            if(res != 'no features were found\n\r' && res != 'no features were found\n' && info != "no features were found\r\n"){
              addFeatureInfoPopup(res, latlng);
            }
          });

        }

      } catch(error) {
        alert('Ha ocurrido un problema');
        console.log(error);
        $('.leaflet-container').css('cursor','-webkit-grab');
        return;
      }
      $('.leaflet-container').css('cursor','-webkit-grab');
      return;
    }  
});

let addInfoBtn = function (label, contentText){
  console.log(contentText)
  return `
  
 
    ${label}  <a onclick="layerInfoClick('${contentText}')"><i style="font-size:20px" class="fa fa-info-circle"></i></a>
 
  `;
};

const magypURL = 'https://geoforestal.magyp.gob.ar/geoserver/dpf/wms';

var magypSource = new MySource(magypURL, {
    'transparent' : true,
    'tiled' : true,
    'format' : 'image/png',
    'info_format': 'text/plain',
    'identify' : true
});
var geoPortalSource = new MySource('https://geo.ambiente.gob.ar/geoserver/bosques/wms', {
    'transparent' : true,
    'tiled' : true,
    'format' : 'image/png',
    'info_format': 'text/plain',
    'identify' : true
});
var conaeSource = new MySource('https://geoservicios.conae.gov.ar/geoserver/GeoServiciosCONAE/wms', {
    'transparent' : true,
    'tiled' : true,
    'format' : 'image/png',
    'info_format': 'text/plain',
    'identify' : true
});

var ignSource = new MySource('https://wms.ign.gob.ar/geoserver/ows', {
    'transparent' : true,
    'tiled' : true,
    'format' : 'image/png',
    'info_format': 'text/plain',
    'identify' : true
});

let macizos_layer = new MySource(magypURL, {
    'transparent' : true,
    'tiled' : true,
    'format' : 'image/png',
    'info_format': 'text/plain',
    'identify' : true, 
}).getLayer('dpf:macizos_forestales_sin_categorizacion_por_especies')

let cortinas_layer = new MySource(magypURL, {
    'transparent' : true,
    'tiled' : true,
    'format' : 'image/png',
    'info_format': 'text/plain',
    'identify' : true
}).getLayer('dpf:cortinas_forestales_publicacion');

let agentes_reg_layer = new MySource(magypURL, {
    'transparent' : true,
    'tiled' : true,
    'format' : 'image/png',
    'info_format': 'text/plain',
    'identify' : true
}).getLayer('dpf:distribucion_agentes_regionales');

var baseMapInfo = {
    'url' : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    'options' : {
        'transparent' : true,
        'format' : 'image/png', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
};
var baseMapTopoMap = {
    'url' : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    'options' : {
        'transparent' : false,
        'format' : 'image/png', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
};
var baseMapGoogle = {
    'url' : 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    'options' : {
        'transparent' : true,
        'format' : 'image/png',
        attribution : '&copy; <a href="https://earth.google.com/" target="_blank">Google Earth</a>'
    }
};



const info_icon = `
  <!DOCTYPE HTML>
  <HTML>
   <HEAD>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
      .text{
        margin: 0 0;
        padding-top: 0 0;
        display:flex;
        background-color : red;
      }
    </style>
   </HEAD>
   <BODY>
    <div class="text">
      <b>Mapas Base</b> 
      <span style="padding-top:0" class="material-icons">terrain</span>
    </div>
   </BODY>
  </HTML>
`;

var baseTreeMap = [
  {
    label :`<b>Capas base</b> 
      <span style="padding-top:0" class="material-icons">terrain</span>` , 
    collapsed : true,
    children : [
       {
            label : 'TopoMap-OSM',
            layer : L.WMS.tileLayer(baseMapTopoMap.url, baseMapTopoMap.options), 
        }, 
        {
            label : 'ArgenMap',
            layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows', {
                'tiled' : true,
                'format': 'image/png',
                'transparent': true,
                'layers': 'capabaseargenmap', 
                attribution:  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
            })
            // Instituto Geográfico Nacional + OpenStreetMap
        },
        {
            label : 'SRTM30-Colored',
            layer : L.WMS.tileLayer("http://ows.mundialis.de/services/service", {
                'format': 'image/png',
                'transparent': false,
                'layers': 'SRTM30-Colored'
            })
        },
        
       {
            label : 'ESA World Cover 2020',
            layer : L.WMS.tileLayer('https://services.terrascope.be/wms/v2', {
                'tiled' : true,
                'format': 'image/png',
                'transparent': true,
                'layers': 'WORLDCOVER_2020_MAP', 
                attribution: '&copy; <a href="	https://terrascope.be/nl" >terrascope</a> contributors'
            })
            // Instituto Geográfico Nacional + OpenStreetMap
        },
        {
            label : 'Imagen satelital Sentinel-2 (2020-FALSO COLOR)',
            layer : L.WMS.tileLayer('https://services.terrascope.be/wms/v2', {
                'tiled' : true,
                'format': 'image/png',
                'transparent': true,
                'layers': 'WORLDCOVER_2020_S2_FCC', 
                attribution: '&copy; <a href="	https://terrascope.be/nl" >terrascope</a> contributors'
            })
            // Instituto Geográfico Nacional + OpenStreetMap
        },
        {
            label : 'Imagen satelital-RADAR-Sentinel 1-(2020 -ratio VV/HH) ',
            layer : L.WMS.tileLayer('https://services.terrascope.be/wms/v2', {
                'tiled' : true,
                'format': 'image/png',
                'transparent': true,
                'layers': 'WORLDCOVER_2020_S1_VVVHratio', 
                attribution: '&copy; <a href="	https://terrascope.be/nl" >terrascope</a> contributors'
            })
            // Instituto Geográfico Nacional + OpenStreetMap
        }/*,
        {
            label : 'Google Hybrid',
            layer : baseMapGoogle = L.WMS.tileLayer(baseMapGoogle.url, baseMapGoogle.options)
        },
        
        {
            label : 'Google Satellite',
            layer : L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
              maxZoom: 20,
              subdomains:['mt0','mt1','mt2','mt3']
              })
        },*/
    ]
}];


var baseLayersTree = [  {
  label : '<b>Límites administrativos</b>',
  collapsed : true,
  children : [{
      label : 'IGN',
      children : [{
          label : 'Provincias',
          layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows', {
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'ign:provincia'})
        }, {
          label : 'Departamentos',
          layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows', {
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'ign:departamento'})
        }
      ]
    }]},
  {
    label: '<b>Detección de Incendios <b> <span class="material-icons">🔥︁</span> <a href="https://drive.google.com/file/d/1uWf7avhwTaCDmcLTDUwPM4YuaAIvzGci/view?usp=sharing" target="_blank" rel="noopener noreferrer">Metodología  </a><span class="material-icons">︁🛰︁</span><a href="https://drive.google.com/file/d/1y2Vv0uFiZryzxGsLSsaz1w6cbI67ofdI/view?usp=sharing" target="_blank" rel="noopener noreferrer"> Video   </a>', 
    collapsed : true,
    children : [
      {
        label : 'Imagen Satelital-Incendio Potrero de Garay - Agosto 2021  ',
        layer : L.WMS.tileLayer('	https://geoforestal.magyp.gob.ar/geoserver/dpf/wms',{
                'transparent' : true,
                'format' : 'image/png',
                'tiled' : true,
                'layers' : 'incendio_Potrero_Garay_agosto_2021'
                })
      }, 
      {
        label : 'Imagen Satelital - Incendio Corrientes - Agosto 2021 ',
        layer : L.WMS.tileLayer('	https://geoforestal.magyp.gob.ar/geoserver/dpf/wms',{
              'transparent' : true,
              'format' : 'image/png',
              'tiled' : true,
              'layers' : 'Incendio_Corrientes_agosto_2021'
              })
      },
       {
        label : 'Cicatriz- área quemada  Incendio Potrero de Garay - Agosto 2021  ',
        layer : L.WMS.tileLayer('	https://geoforestal.magyp.gob.ar/geoserver/dpf/wms',{
              'transparent' : true,
              'format' : 'image/png',
              'tiled' : true,
              'layers' : 'incendio_cordoba_agosto_2021  '
              })
      }, {
        label : 'Cicatriz- área quemada Incendio Corrientes - Agosto 2021  ',
        layer : L.WMS.tileLayer('	https://geoforestal.magyp.gob.ar/geoserver/dpf/wms',{
              'transparent' : true,
              'format' : 'image/png',
              'tiled' : true,
              'layers' : 'incendio_corrientes_agosto_2021  '
              })
      }, {
        label : 'Cicatriz- área quemada  Incendio noviembre Villa Olivari 2021  ',
        layer : L.WMS.tileLayer('	https://geoforestal.magyp.gob.ar/geoserver/dpf/wms',{
              'transparent' : true,
              'format' : 'image/png',
              'tiled' : true,
              'layers' : 'incendio_corrientes_noviembre_villa_olivari_2021  '
              })
      },
      {
        label : 'Cicatriz- área quemada  Incendio diciembre Aluminé 2021  ',
        layer : L.WMS.tileLayer('	https://geoforestal.magyp.gob.ar/geoserver/dpf/wms',{
              'transparent' : true,
              'format' : 'image/png',
              'tiled' : true,
              'layers' : 'incendio_alumine_diciembre_2021'
              })
      },
      {
        label : 'Focos de Calor <span class="material-icons"></span>',
        children : [
          {
            label : 'Focos de calor - CONAE (FIRMS)',
            layer : conaeSource.getLayer('informacion_satelital')
          } 
        ]
      }
    ]
  }
, 
 
 
  {
  label : '<b>Cartografía Forestal</b><span class="material-icons">︁🌲︁🌳</span>',
  collapsed : false,
  children : [

    {
      label : '<b> Área SIG </b> <a href="https://public.tableau.com/app/profile/fhorn/viz/Tableroplantacionesforestales/Dashboard1" usp=sharing" target="_blank" rel="noopener noreferrer"> Tablero de Plantaciones Forestales ',
      children : [
        
        /*{ 
          label : 'Puntos App RegistFor <span class="material-icons">︁!︁</span>',
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'dpf:puntos_registfor'})
        },*/{
          label : 'Agentes regionales  <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/tecnicos_regionales" target="_blank" rel="noopener noreferrer"> Referencias </a> <span class="material-icons">︁</span>' ,
          //layer : L.WMS.tileLayer(magypURL, {
          //  'transparent' : true,
          //  'format' : 'image/png',
           // 'tiled' : true,
            //'layers' : //'dpf:macizos_forestales_sin_categorizacion_por_especies'})
          
          layer : agentes_reg_layer
        },
        {
          //label : `Macizos Forestales ; <a href="https://drive.google.com/file/d/1aj5QaI_PCSwitHA554isFLjzvAdXtMy1/view?usp=sharing usp=sharing"target="_blank" rel="noopener noreferrer"> Metodología y &copy CITA </a><span class="material-icons">︁</span>`
          //layer : L.WMS.tileLayer(magypURL, {
          //  'transparent' : true,
          //  'format' : 'image/png',
           // 'tiled' : true,
            //'layers' : //'dpf:macizos_forestales_sin_categorizacion_por_especies'})
          //label : `Macizos Forestales Metodología y &copy CITA  ` + info_button,
          label : addInfoBtn('Macizos Forestales Metodología y &copy CITA','macizos'),
          layer : macizos_layer
        },

        {
          label : 'Macizos Forestales por grupos de especies ' ,
          //layer : L.WMS.tileLayer(magypURL, {
          //  'transparent' : true,
          //  'format' : 'image/png',
           // 'tiled' : true,
            //'layers' : //'dpf:macizos_forestales_sin_categorizacion_por_especies'})
          layer : magypSource.getLayer('dpf:macizos_forestales_publicacion_con_formato')
        },
        {
          label : 'Cortinas Forestales',
          //layer : L.WMS.tileLayer(magypURL, {
          //  'transparent' : true,
          //  'format' : 'image/png',
          //  'tiled' : true,
          //  'layers' : 'dpf:cortinas_forestales_publicacion'})
          layer : cortinas_layer
        }
      ]
    }, 
    
    
      /*{
        label : 'Focos de calor - VIIRS Fires - Past 7 Days',
        layer : L.WMS.tileLayer('https://firms.modaps.eosdis.nasa.gov/wms/key/accd9ceab38b58bc58a7cd98e1c943ba/', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'fires_viirs_7'})
      }, 
      {
        label : 'Focos de calor - MODIS Fires - Past 7 Days',
        layer : L.WMS.tileLayer('https://firms.modaps.eosdis.nasa.gov/wms/key/accd9ceab38b58bc58a7cd98e1c943ba/', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'fires_modis_7'})
      }*/
      ]
    },



{
  label : '<b>Productos</b><span class="material-icons">︁🌲︁🌳</span>',
  collapsed : true,
  children : [

    {
      label : '<b> Alturas de plantaciones forestales </b>',
      collapsed : true,
      children : [
{
      label : '<b>Alturas modeladas <b><span class="material-icons">︁🛰︁</span><a href="https://mgaute14.users.earthengine.app/view/appalturaplantacionesforestalesentreros" target="_blank" rel="noopener noreferrer"> App</a> y  <a href="https://github.com/mg14github/Characterization-of-forest-plantations-based-on-information-derived-from-satellite-platforms-and-hig" usp=sharing" target="_blank" rel="noopener noreferrer"> Referencias <a'  ,
      collapsed : true,
      children : [ {
        label : 'Modelo - Altura Plantaciones ( Norte y Centro de Entre Ríos)' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'altura_plantaciones_2'})
      } , {
        label : 'Modelo - Altura Plantaciones (Sur - Entre Ríos)' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'altura_plantaciones_1'})
      } ]},


      {
      label : '<b> Datos LIDAR ICESAT 2 -ATL08   <b><span class="material-icons">︁🛰︁</span><a <a href="https://nsidc.org/data/ATL08" usp=sharing" target="_blank" rel="noopener noreferrer"> Referencias  <a'  ,
      collapsed : true,
      children : [

      { label: '<b>NEA + DELTA + SUDESTE <b>',
        collapsed : true,
      children : [
      {
        label : 'Altura de Canopeo -Entre Ríos',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_entre_rios_2021'})
      } , {
        label : 'Altura de Canopeo -Buenos Aires',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_sudeste_2021'})
      } ,
      {
        label : 'Altura de Canopeo -Corrientes ' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_corrientes_2021'})
      } , {
        label : 'Altura de Canopeo -Misiones ' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_misiones_2021'})
      },{
        label : 'Altura de Canopeo -Delta ' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_delta_2021'})
      } ]} ,  

      { label: '<b>NOA<b>',
        collapsed : true,
      children : [ 

 {
        label : 'Altura de Canopeo -Tucumán ' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_tucuman_2021'})
      } ,
      {
        label : 'Altura de Canopeo -Salta ' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_salta_2021'})
      }]}, 

      { label: '<b>Patagonia<b>',
        collapsed : true,
      children : [

{
        label : 'Altura de Canopeo -Neuquén',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_neuquen_2021'})
      },{
        label : 'Altura de Canopeo -Río Negro ' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_rio_negro_2021'})
      },
      {
        label : 'Altura de Canopeo -Chubut ' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_chubut_2021'})
      } ]}, 

      { label: '<b>Centro <b>',
        collapsed : true,
      children : [
      {
        label : 'Altura de Canopeo -Córdoba ' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'icesat_cordoba_2021'})
      }]} ]}, 
      {
      label : '<b> Datos LIDAR GEDI 2    <b><span class="material-icons">︁🛰︁</span><a <a href="https://gedi.umd.edu/data/products/" target="_blank" rel="noopener noreferrer"> Referencias  <a'  ,
      collapsed : true,
      children : [

      { label: '<b>NEA + DELTA + SUDESTE <b>',
        collapsed : true,
      children : [
      {
        label : 'Altura de Canopeo GEDI V2. (rh95) 2020-2021-Entre Ríos',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'puntos_GEDI_2020_2021_entre_rios'})
      },
      {
        label : 'Altura de Canopeo GEDI V2. (rh95) 2020-2021-Corrientes',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'puntos_gedi_2020_2021_corrientes'})
      }, 
      {
        label : 'Altura de Canopeo GEDI V2. (rh95) 2020-2021-Misiones',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'puntos_gedi_2020_2021_misiones'})
      }
      ]}, 
      { label: '<b> Patagonia <b>',
        collapsed : true,
      children : [
      {
        label : 'Altura de Canopeo GEDI V2. (rh95) 2020-2021-Neuquén',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'Neuquen_GEDI'})
      },
      {
        label : 'Altura de Canopeo GEDI V2. (rh95) 2020-2021-Chubut',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'Chubut_GEDI'})
      } ]}, 

      { label: '<b> Centro <b>',
        collapsed : true,
      children : [
      {
        label : 'Altura de Canopeo GEDI V2. (rh95) 2020-2021-Córdoba',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'Cordoba_GEDI'})
      } ]}, 
      
      { label: '<b> NOA <b>',
        collapsed : true,
      children : [
      {
        label : 'Altura de Canopeo GEDI V2. (rh95) 2020-2021-Jujuy',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'Jujuy_GEDI'})
      } ]}, 
      
      { label: '<b> CUYO <b>',
        collapsed : true,
      children : [
      {
        label : 'Altura de Canopeo GEDI V2. (rh95) 2020-2021-Mendoza',
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'Mendoza_GEDI'})
      } ]}
      ]} 
    
      ]} ,   

       {
      label : '<b>Análisis de Cambios<b> <a href="https://drive.google.com/file/d/1lb24iBB-5UxGBTy-mb1uSORcR5bIlgPT/view?usp=sharing " target="_blank" rel="noopener noreferrer">Evaluación de Productos </a><span class="material-icons">︁🛰︁</span><a href="https://drive.google.com/file/d/1UopLIwRZdkKLA1VDoudkKmaoP9DnCDcm/view?usp=sharing" target="_blank" rel="noopener noreferrer">Evaluación de análisis de control de cambios</a>' ,
      collapsed : true,
      children : [

        , { 
        label : 'Historial de aprovechamientos forestales - Corrientes (2000-2019)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/" >Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'cosechados_2000_2019_Corrientes'} )},
            
            { 
        label : 'Historial de aprovechamientos forestales - Misiones (2000-2019)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'cosechados_2000_2019_Misiones'} )},
            { 
        label : 'Historial de aprovechamientos forestales - Entre Ríos (2000-2019)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'cosechados_2000_2019_Entre_Rios'} )},
            
        { label: '<b>Estado actual de las plantaciones</a><b> <a href="https://mgaute14.users.earthengine.app/view/appestadosplantacionesnea" target="_blank" rel="noopener noreferrer"> <b>App<b> Estado de situación NEA 2021 </a>, <a href="https://mgaute14.users.earthengine.app/view/estadoydirecciondel-cambioplantacionesforestalescorrient" target="_blank" rel="noopener noreferrer"> <b>App<b> Dirección de cambios. Corrientes 2021 </a>'   , 
        children: [{
        label : ' Corrientes diciembre - 2021)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'dpf:mapa_de_cambios_corrientes'}, )
        },{ 
        label : 'Aprovechamientos forestales - Corrientes Agosto (2020-2021)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'aprovechamientos_forestales_corrientes_2020_2021'}, )
        }  ]}]
    } ]} ,
  
      
      /*{
        label : 'Focos de calor - VIIRS Fires - Past 7 Days',
        layer : L.WMS.tileLayer('https://firms.modaps.eosdis.nasa.gov/wms/key/accd9ceab38b58bc58a7cd98e1c943ba/', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'fires_viirs_7'})
      }, 
      {
        label : 'Focos de calor - MODIS Fires - Past 7 Days',
        layer : L.WMS.tileLayer('https://firms.modaps.eosdis.nasa.gov/wms/key/accd9ceab38b58bc58a7cd98e1c943ba/', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'fires_modis_7'})
      }*/
      
    
  {
  
  label: '<b>Información complementaria <b><span class="material-icons"></span>',
  collapsed : true, 
  children : [{
    label : ' Pedregal - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            attribution:  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
            'layers' : 'ign:edafologia_pedregal'
            } )},


            {
    label : ' Arenal - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            attribution:  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
            'layers' : 'ign:edafologia_arenal'
            } )},
            {
    label : ' Curvas de Nivel - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            attribution:  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
            'layers' : 'ign:lineas_de_geomorfologia_CA010'
            } )},
            {
    label : ' Cartas 1: 50000 - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            attribution:  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
            'layers' : 'ign:cartas_50000'
            } )},
            
    
            {
    label : ' Puertos - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            attribution:  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
            'layers' : 'ign:puntos_de_puertos_y_muelles_BB005'
            } )}, 

            ]},{
    label : '<b> Imágenes de Alta Resolución Espacial</b>',
    collapsed : true,
    children :  
      [{
        label : 'DELTA',
        layer : L.WMS.tileLayer('	https://api.ellipsis-drive.com/v1/wms/5fe5a1ef-dfa3-43f6-96d7-7c439cb7cba4' ,{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://satellogic.com/" >Satellogic</a> contributors',
            'layers' : 'f770381d-5e24-419b-859b-fa26320d105c_625b5a87-5b3b-4c73-8dba-82b61e181d70' }),
      }]},
            
            
            {
    label : '<b> Vuelos-IGN</b>',
    collapsed : true,
    children :  
      [{
        label : 'Bariloche 2014',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows' ,{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors',
            'layers' : 'bariloche_1.2_2014' }),
      },
       {
        label : 'San Martín de los Andes 2014',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors', 
            'layers' : 'bariloche_1.1_2014' })
      
    }, 
    {
        label : 'Valle_del_rio_negro_2014_2.5',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors', 
            'layers' : 'valle_del_rio_negro_2014_2.5' })
      
    }, 
    {
        label : 'Valle_del_rio_negro_2014_2.4',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors', 
            'layers' : 'valle_del_rio_negro_2014_2.4' })
      
    }, 
    {
        label : 'Valle_del_rio_negro_2014_2.3',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors', 
            'layers' : 'valle_del_rio_negro_2014_2.3' })
      
    }, 
    {
        label : 'Valle_del_rio_negro_2014_2.2',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors', 
            'layers' : 'valle_del_rio_negro_2014_2.2' })
      
    }, 
    {
        label : 'Valle_del_rio_negro_2014_2.1',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors', 
            'layers' : 'valle_del_rio_negro_2014_2.1' })
      
    }, 

  ]} /*, //Ordenamientos territoriales / Ocultas
  // Al comentar las capas que siguen abajo hay que cerrar con ]; 
     {
      label : '<b>Ordenamientos territoriales - MAyDS <b><span class="material-icons"></span>  ',
      collapsed : true,
      children : [  {
        label : 'OTBN Misiones',
        layer : L.WMS.tileLayer('https://geo.ambiente.gob.ar/geoserver/bosques/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'otbn_ms_3857'})
      },
        
        {
        label : 'OTBN Corrientes',
        layer : L.WMS.tileLayer('https://geo.ambiente.gob.ar/geoserver/bosques/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'otbn_cs_3857'})
      }, {
        label : 'OTBN Entre Ríos',
        layer : new MySource('https://geo.ambiente.gob.ar/geoserver/bosques/wms', {
          'transparent' : true,
          'tiled' : true,
          'format' : 'image/png',
          'info_format': 'text/plain',
          'identify' : true
        }).getLayer('otbn_er_3857')
        //layer : L.WMS.tileLayer('https://geo.ambiente.gob.ar/geoserver/bosques/wms', {
          //'transparent' : true,
          //'format' : 'image/png',
          //'tiled' : true,
          //'layers' : 'otbn_er_3857'})
      },   {
        label : 'OTBN Buenos Aires',
        layer : L.WMS.tileLayer('https://geo.ambiente.gob.ar/geoserver/bosques/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'otbn_ba_38570'})
      }]
     }*/];

    

var baseTreeLayersWithInfo = [{
    label : '<b>Ver informacion de capas</b> <span class="material-icons">info</span>',
    collapsed : true,
    children : [{
      label : 'MAGyP',
      children : [{ 
          label : 'Puntos RegistFor ',
          layer : magypSource.getLayer('dpf:puntos_registfor')
        },
        {
          label : 'Macizos forestales',
          layer : magypSource.getLayer('dpf:macizos_forestales_publicacion')
        },
        {
          label : 'Cortinas forestales',
          layer : magypSource.getLayer('dpf:cortinas_forestales_publicacion')
        }]
    }, {
      label : 'GeoServiciosCONAE',
      children : [{
        label : 'Focos de calor',
        layer : conaeSource.getLayer('informacion_satelital')
      }]
    }, {
      label : 'Corrientes',
      children : [{
        label : 'OTBN Corrientes',
        layer : geoPortalSource.getLayer('otbn_cs_3857')
      }]
    },{
      label : 'Entre Ríos',
      children : [{
        label : 'OTBN Entre Ríos',
        layer : geoPortalSource.getLayer('otbn_er_3857')
      }]
    },
    {
      label : 'Misiones',
      children : [{
        label : 'OTBN Misiones',
        layer : geoPortalSource.getLayer('otbn_ms_3857')
      }]
    }, 
  {
      label : 'Curvas de Nivel - IGN',
      children : [{
        label : 'Curvas de Nivel - IGN',
        layer : ignSource.getLayer('ign:lineas_de_geomorfologia_CA010')
      }]
    } ,{
      label : 'Cartas 1:50000 ',
      children : [{
        label : 'Cartas 1:50000 - IGN',
        layer : ignSource.getLayer('ign:cartas_50000')
      }]
    } ,
    {
      label : 'Capa vacía',
      layer : L.tileLayer('')
    }
  ]
}];



//magypSource.getLayer('dpf:macizos_forestales_publicacion').addTo(map);


export{baseTreeLayersWithInfo, baseLayersTree, baseTreeMap};

////asdasd
