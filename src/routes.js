import { createRequire } from 'module';
import { getS3Object } from './libs/get_s3object.mjs';

const require = createRequire(import.meta.url);

const router = new require('express').Router();
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');
const cors = require('cors');
//const getS3OBject = require('./src/libs/get_s3object.mjs')
//import fetch from "node-fetch";

// Default route, get index.html
router.get('/', (require, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'))
});

// Route for make a request to url specified on post, and retreive info on json format
// Post with: header => content : aplication/json
//            body => url : "url/wms"
router.post('/getFeatureInfo', (req, res) => {
  router.use(bodyParser.json());
  var data = "";
  var url = req.body.url;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = body;
      res.json({ 
        status : 'success',
        answer : data 
      });
    }
  });

});

//Get tiff image from url. The image must be lighter than 100Mb for google drive
// Cambiar a POST
router.get('/getImageFromDrive', (req, res) => {
  
  const tif_url = 'https://drive.google.com/uc?id=1muX3jdwiWRhr5l17bbW36y8Mc3FShHBN&export?format=tif'; // Areas quemadas

  fetch(tif_url)
  .then(response => response[Object.getOwnPropertySymbols(response)[1]])
  .then(data => data.url)
  .then((url) => {
    fetch(url)
    .then((response) => {      
      return response.buffer();
    })
    .then((buffer) => {
      res.send(buffer);
    });
  });
});

router.get('/sentinel-assets', cors({ 'origin' : '*'}), (request, response) => {
  let query = request.query;
  console.log(query);

  if(query.bucket == undefined || query.key == undefined){
    response.sendStatus(422);
  } else {
    getS3Object({
      Bucket : query.bucket,
      Key : query.key
    }).then(data => {
      response.send(data);
    });
  }
});

export{router};

/*PARA HACER
 lo q falta es agregar un logo, banner con nombre del visor.. y los botones de info  ( de cada) como para leer de q se trata.. una mini referencia */