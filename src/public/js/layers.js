import {map, geotiffControl} from './main.js';
// Extension de la clase L.WMS.Source que maneja el pedido de getFeatureInfo() y crea un popup en base a la informacion retornada.
function addFeatureInfoPopup(info, latlng){
  var popup = new L.popup({
    closeOnClick : false,
    autoClose : false
    });
  let stacked_text = info; // Texto que se irá acumulando en el popup
  
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
                attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional + OpenStreetMap</a> contributors'
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
            label : 'Google Hybrid',
            layer : baseMapGoogle = L.WMS.tileLayer(baseMapGoogle.url, baseMapGoogle.options)
        },
        /*
        {
            label : 'Google Satellite',
            layer : baseMapGoogle = L.WMS.tileLayer(baseMapGoogle.url, baseMapGoogle.options)
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
    label: '<b>Detección de Incendios <b> <span class="material-icons">🔥︁</span> <a href="https://drive.google.com/file/d/1uWf7avhwTaCDmcLTDUwPM4YuaAIvzGci/view?usp=sharing">Metodología  </a><span class="material-icons">︁🛰︁</span><a href="https://drive.google.com/file/d/1y2Vv0uFiZryzxGsLSsaz1w6cbI67ofdI/view?usp=sharing"> Video   </a>', 
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
      }, 
      {
        label : 'Focos de Calor <span class="material-icons"></span>',
        children : [
          {
            label : 'Focos de calor - CONAE (FIRMS)',
            layer : L.WMS.tileLayer('https://geoservicios.conae.gov.ar/geoserver/GeoServiciosCONAE/wms', {
              'transparent' : true,
              'format' : 'image/png',
              'tiled' : true,
              'layers' : 'informacion_satelital'})
          } 
        ]
      }
    ]
  }
, 
 
 
  {
  label : '<b>Cartografía Forestal</b><span class="material-icons">︁🌲︁🌳</span>',
  collapsed : true,
  children : [

    {
      label : '<b> MAGYP </b> <a href="https://public.tableau.com/app/profile/fhorn/viz/Tableroplantacionesforestales/Dashboard1" usp=sharing"> DASHBOARD ',
      children : [
        
        /*{ 
          label : 'Puntos App RegistFor <span class="material-icons">︁!︁</span>',
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'dpf:puntos_registfor'})
        },*/
        {
          label : 'Macizos Forestales ; <a href="https://drive.google.com/file/d/1aj5QaI_PCSwitHA554isFLjzvAdXtMy1/view?usp=sharing usp=sharing" usp=sharing"> Metodología y &copy CITA </a><span class="material-icons">︁</span>' ,
          //layer : L.WMS.tileLayer(magypURL, {
          //  'transparent' : true,
          //  'format' : 'image/png',
          //  'tiled' : true,
          //  'layers' : 'dpf:macizos_forestales_publicacion'})
          layer : magypSource.getLayer('dpf:macizos_forestales_sin_categorizacion_por_especies')
        },
        {
          label : 'Cortinas Forestales',
          //layer : L.WMS.tileLayer(magypURL, {
          //  'transparent' : true,
          //  'format' : 'image/png',
          //  'tiled' : true,
          //  'layers' : 'dpf:cortinas_forestales_publicacion'})
          layer : magypSource.getLayer('dpf:cortinas_forestales_publicacion')
        }
      ]
    }, 
    {
      label : '<b>Análisis de Cambios<b> <a href="https://docs.google.com/document/d/1TzI8jS5VZoV8gXcLASCwE0KU8-lVXJhON88iaJ-OGck/edit?usp=sharing">Evaluación de Productos </a><span class="material-icons">︁🛰︁</span><a href="https://drive.google.com/file/d/1A_PoGaO2kMOfrwe21Xk1iyWN0NTklC5L/view?usp=sharing">Evaluación de análisis de control de cambios</a>' ,
      collapsed : true,
      children : [

        , { 
        label : 'Historial de aprovechamientos forestales - Corrientes (2000-2019)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
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
            { 
        label : 'Aprovechamientos forestales - Corrientes Agosto (2020-2021)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'aprovechamientos_forestales_corrientes_2020_2021'}, )
        } ,
        { label: '<b>Estado actual de las plantaciones</a><b>', 
        children: [{
        label : ' Corrientes Agosto (2020-2021)',
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'mapa_de_cambios_corrientes'}, )
        } ]}]
    }
    , 
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
      label : '<b>Productos<b><span class="material-icons">︁ </span><a href="https://youtu.be/3a1RJmHuFkI usp=sharing"> Video <a'   ,
      collapsed : true,
      children : [ {
        label : 'Altura Plantaciones ( Norte y Centro de Entre Ríos) MIN: 0 MAX: 50 m <a href="https://github.com/mg14github/Characterization-of-forest-plantations-based-on-information-derived-from-satellite-platforms-and-hig" usp=sharing"> Referencias  <a' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'altura_plantaciones_2'})
      } , {
        label : 'Altura Plantaciones (Sur - Entre Ríos) MIN: 0 MAX: 50 m <a href="https://github.com/mg14github/Characterization-of-forest-plantations-based-on-information-derived-from-satellite-platforms-and-hig" usp=sharing"> Referencias  <a' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'altura_plantaciones_1'})
      } 
      
      
      
      ,{
        label : 'Altura de Canopeo -Entre Ríos - ICESAT 2 - Sensor ATL08 <a href="https://nsidc.org/data/ATL08" usp=sharing"> Referencias  <a' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'alturas_canopeo_ICESAT2_ER_2021'})
      } ,{
        label : 'Altura de Canopeo -Corrientes - ICESAT 2 - Sensor ATL08 <a href="https://nsidc.org/data/ATL08" usp=sharing"> Referencias  <a' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'ICESAT2_Corrientes_2021'})
      } , {
        label : 'Altura de Canopeo -Misiones - ICESAT 2 - Sensor ATL08 <a href="https://nsidc.org/data/ATL08" usp=sharing"> Referencias  <a' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' :
          'ICESAT2_Misiones_2021'})
      } 
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
    }
    ,
    
  {
  
  label: '<b>Información complementaria <b><span class="material-icons"></span>',
  collapsed : true, 
  children : [{
    label : ' Pedregal - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'ign:edafologia_pedregal'
            } )},


            {
    label : ' Arenal - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'ign:edafologia_arenal'
            } )},
            {
    label : ' Curvas de Nivel - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'ign:lineas_de_geomorfologia_CA010'
            } )},
            {
    label : ' Cartas 1: 50000 - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'ign:cartas_50000'
            } )},
            
    
            {
    label : ' Puertos - IGN ',
    layer : L.WMS.tileLayer('https://wms.ign.gob.ar/geoserver/ows?',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'ign:puntos_de_puertos_y_muelles_BB005'
            } )}, 

            ]},{
    label : '<b> Vuelos-IGN</b>',
    collapsed : true,
    children :  
      [{
        label : 'Vuelo Corrientes- Resistencia 2016',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows' ,{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors',
            'layers' : 'corrientes-resistencia_2016' }),
      },
       {
        label : 'Vuelo Zárate- Campana 2015',
        layer : L.WMS.tileLayer('	https://imagenes.ign.gob.ar/geoserver/ortomosaicos_fotogrametria/ows',{
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
             attribution: '&copy; <a href="https://www.ign.gob.ar" >Instituto Geográfico Nacional </a> contributors', 
            'layers' : 'zarate_campana_2015' })
      
    }
  ]} ,
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
    }];

    

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

export{baseTreeLayersWithInfo, baseLayersTree, baseTreeMap};

////asdasd