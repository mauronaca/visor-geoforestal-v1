import {map, geotiffControl} from './main.js';
import {baseTreeLayersWithInfo, baseLayersTree, baseTreeMap} from "./layers.js";

// --- Metodo para levantar imagen TIF liviana, anda perfecto ---
var addAreasQuemadas = fetch('./getImageFromDrive')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {
      console.log("georaster:", georaster);

      const min = georaster.mins[0];
      const max = georaster.maxs[0];
      const range = georaster.ranges[0];

      var layer = new GeoRasterLayer({
        georaster: georaster,
        opacity: 1,
        pixelValuesToColorFn: function(value){
          var scale = chroma.scale([chroma('white').alpha(0), 'yellow', 'red']);
          var scaledPixel = (value - min) / range;
          return scale(scaledPixel).hex();
        },
        resolution: 64,
        pane : 'geotif-pane'
    });

    //layer.addTo(map);
    var svg = "<i class='bi bi-tree-fill'></i>";
    geotiffControl.addOverlay(layer, '<b>Areas Quemadas</b>'+svg);
    //map.fitBounds(layer.getBounds()); // Para que el mapa vaya a la ubicacion en donde se creo la capa.
  });
});

// Hacer un get al servidor para que entregue los links para evitar que sea vean aca y sean publicos
var sentinel_concordia_B3 = 'https://tif-images-delivery-test-v1.s3.us-east-2.amazonaws.com/images/sentinel/001ER/SentinelB3COG.tiff'//'https://www.googleapis.com/drive/v3/files/1juDcZnXFJIifGW45mydcMLTEGRNgCgl0?alt=media&key=AIzaSyCNxw7IdcBM7jmgCqIPPftaOlBP633k0GM'
var sentinel_concordia_B11 = 'https://tif-images-delivery-test-v1.s3.us-east-2.amazonaws.com/images/sentinel/001ER/SentinelB11COG.tiff'//'https://www.googleapis.com/drive/v3/files/1PPsbGLwGYQksBFalx4bRiE_a_kHgwvOv?alt=media&key=AIzaSyCNxw7IdcBM7jmgCqIPPftaOlBP633k0GM'
var sentinel_concordia_B8 = 'https://tif-images-delivery-test-v1.s3.us-east-2.amazonaws.com/images/sentinel/001ER/SentinelB8COG.tiff'//'https://www.googleapis.com/drive/v3/files/1gCENjOAfDkoCmAJOilK3j5wzTRyU0Nu8?alt=media&key=AIzaSyCNxw7IdcBM7jmgCqIPPftaOlBP633k0GM'

var addSentinelConcordia = Promise.all([
  parseGeoraster(sentinel_concordia_B8),
  parseGeoraster(sentinel_concordia_B11),
  parseGeoraster(sentinel_concordia_B3),
])
.then(georasters => {
  var pixelValuesToColorFn = values => {
    const [ VNIR, SWIR , GREEN ] = values;
    if((VNIR !== 0 && isNaN(VNIR) == false) && (SWIR !== 0 && isNaN(SWIR) == false) && (GREEN !== 0 && isNaN(GREEN) == false)){
  
      // Normalizo los pixeles de cada banda; las imagenes del sentinel son de 12 bits
      //  (fuente: https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-2-msi/resolutions/radiometric)
      // por lo tanto cada pixel lo divido por 2**12-1 y luego lo escalo por 255 pra obtener un color en RGB
      const r = Math.round(VNIR / 4095 * 255); 
      const g = Math.round(SWIR /4095 *255);
      const b = Math.round(GREEN /4095 *255);

      const rgba =  `rgba(${r},${g},${b}, 1)`;
      
      return rgba;
    } else {
      // Si los pixeles son NaN o de valor nulo
      return `rgba(0,0,0,0)`;
    }
  };

  var layer = new GeoRasterLayer({
    georasters,
    pixelValuesToColorFn,
    resolution: 64,
    pane : 'geotif-pane'
  });

  //layer.addTo(map);
  geotiffControl.addOverlay(layer, '<b>Sentinel Concordia</b>');
  //map.fitBounds(layer.getBounds());
});

/*
var sentinelConcordiaPromise = await Promise.all([
  parseGeoraster('https://tif-images-delivery-test-v1.s3.us-east-2.amazonaws.com/images/sentinel/001ER/SentinelB3COG.tiff'),
])
var myBlob = await 
.then(georasters => {
  var pixelValuesToColorFn = values => {
    const scale = chroma.scale(['white', 'black']).domain([0, 255]);
    const [ VNIR] = values;
    console.log(values)
    if((VNIR !== 0 && isNaN(VNIR) == false) ){

      const rgba =  scale(VNIR);
      
      return rgba;
    } else {
      // Si los pixeles son NaN o de valor nulo
      return `rgba(0,0,0,0)`;
    }
  };

  var layer = new GeoRasterLayer({
    georasters,
    pixelValuesToColorFn,
    resolution: 64,
    pane : 'geotif-pane'
  });

  //layer.addTo(map);
  geotiffControl.addOverlay(layer, '<b>Sentinel Concordia -- Byte Format</b>');
  //map.fitBounds(layer.getBounds());
});

*/
export{addAreasQuemadas, addSentinelConcordia};