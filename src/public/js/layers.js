var popup = L.popup({
    'autoPanPadding' : L.point(200, 200)
});
var popup_on = true;

// Extension de la clase L.WMS.Source que maneja el pedido de getFeatureInfo() y crea un popup en base a la informacion retornada.
var MySource = L.WMS.Source.extend({
    'showFeatureInfo' : function(latlng, info){
        if(!popup_on){
            $('.leaflet-container').css('cursor','-webkit-grab');
            return;
        }
        if(!this._map){
            return; 
        }
        console.log(latlng);
        console.log(info);
        //popup.setLatLng(e.latlng).setContent("gg").openOn(this._map);
        popup
        .setLatLng(latlng)
        .setContent(info)
        .openOn(this._map);
        $('.leaflet-container').css('cursor','-webkit-grab');
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
    label: '<b>Detección de Incendios <b> <span class="material-icons">🔥︁</span>', 
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
      children : [{ 
          label : 'Puntos App RegistFor <span class="material-icons">︁!︁</span>',
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'dpf:puntos_registfor'})
        },
        {
          label : 'Macizos Forestales ; <a href="https://drive.google.com/file/d/1aj5QaI_PCSwitHA554isFLjzvAdXtMy1/view?usp=sharing usp=sharing" usp=sharing"> Metodología y &copy CITA </a><span class="material-icons">︁</span>' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'dpf:macizos_forestales_publicacion'})
        },
        {
          label : 'Cortinas Forestales',
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            'tiled' : true,
            'layers' : 'dpf:cortinas_forestales_publicacion'})
        }
      ]
    }, 
    {
      label : '<b>Análisis de Cambios<b> &copy; <a href="https://drive.google.com/file/d/1A_PoGaO2kMOfrwe21Xk1iyWN0NTklC5L/view?usp=sharing">Metdología </a><span class="material-icons">︁🛰︁</span>',
      children : [{ 
        label : 'Estado de plantaciones forestales  Corrientes ( Resto) Agosto  (2020-2021)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'Direccion_cambio_forestal_agosto_2020_2021_Corrientes_Resto'}, )
        },{ 
        label : 'Estado de plantaciones forestales Noreste de Corrientes Agosto (2020-2021)'+ '<BR> - Azul: En desarrollo sin cambios significativos. ' + '<BR> - Verde: Reforestación o Recuperación del crecimiento. '+'<BR> - Rojo: Aprovechamiento Forestal o afectado por incendio.' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : ':Direccion_cambio_forestal_agosto_2020_2021_Corrientes_Noreste'}, )
        },{ 
        label : 'Aprovechamientos forestales Noreste de Corrientes Agosto (2020-2021)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'Cosechas_Corrientes_Noreste_Agosto_2021'}, )
        } , { 
        label : 'Aprovechamientos forestales - Corrientes ( Resto) - Agosto(2020-2021)' ,
          layer : L.WMS.tileLayer(magypURL, {
            'transparent' : true,
            'format' : 'image/png',
            attribution: '&copy; <a href="https://www.magyp.gob.ar/sitio/areas/ss_desarrollo_foresto_industrial/">Área SIG e Inventario Forestal</a> contributors',
            'tiled' : true,
            'layers' : 'Cosechas_Corrientes_Resto_Agosto_2021'}, )
        }]
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
      label : '<b>Altura Forestal <b><span class="material-icons">︁ </span>'  ,
      collapsed : true,
      children : [ {
        label : 'Altura Plantaciones ( Norte y Centro de Entre Ríos Norte y Centro) <a href="https://github.com/mg14github/Characterization-of-forest-plantations-based-on-information-derived-from-satellite-platforms-and-hig" usp=sharing"> Referencias  <a' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'altura_plantaciones_2'})
      } , {
        label : 'Altura Plantaciones (Sur - Entre Ríos) <a href="https://github.com/mg14github/Characterization-of-forest-plantations-based-on-information-derived-from-satellite-platforms-and-hig" usp=sharing"> Referencias  <a' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'altura_plantaciones_1'})
      } ,{
        label : 'Altura de Canopeo - ICESAT 2 <a href="https://nsidc.org/data/ATL08" usp=sharing"> Referencias  <a' ,
        layer : L.WMS.tileLayer('https://geoforestal.magyp.gob.ar/geoserver/dpf/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'elev_2021-03-06_t1100_1629683372509_macizos_concordia'})
      } ,
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
        layer : L.WMS.tileLayer('https://geo.ambiente.gob.ar/geoserver/bosques/wms', {
          'transparent' : true,
          'format' : 'image/png',
          'tiled' : true,
          'layers' : 'otbn_er_3857'})
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