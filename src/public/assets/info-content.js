function content(id){
  let pp = document.createElement('p');
  pp.id = "information-content-text"
  //pp.innerHTML = `<a target="_blank "href="https://drive.google.com/file/d/1aj5QaI_PCSwitHA554isFLjzvAdXtMy1/view?usp=sharing">Macizos Forestales Metodología y &copy CITA</a>`;
  pp.innerHTML = `
  
    <b>Mapa de plantaciones forestales – Año 2021</b>
    <br><br><br>
    <b>Cita</b>: Mapa de Plantaciones Forestales de Actualización Permanente. Área SIG
    e Inventario Forestal. Dirección Nacional de Desarrollo Foresto Industrial.
    Ministerio de Agricultura Ganadería y Pesca de la Nación. 2021
    <br><br>
    En el marco del monitoreo de los planes presentados ante la Ley de Promoción
    Forestal 25.080 y su prórroga la Ley 26.432, el Área SIG e Inventario Forestal de
    la Dirección Nacional de Desarrollo Foresto Industrial (DNDFI) es la responsable
    de la generación de la cartografía que conforma el mapa de plantaciones
    forestales de la República Argentina.
    El proceso de colecta y generación de información es un proceso continuo que
    se inicia con la ejecución del Inventario Nacional de Plantaciones Forestales de
    la República Argentina (1998-2000) hasta la fecha en que se sigue actualizando
    y/o incorporando información.
    La misma corresponde a información vectorial georreferenciada representada
    con geometría de líneas para las cortinas forestales y de polígonos para los
    macizos forestales, generada a partir de múltiples fuentes de información y
    procesamiento.
    <ul>
      <li>
      Interpretación visual y digitalización sobre imágenes satelitales de alta
      resolución espacial como SPOT 6 y 7 en su modo multiespectral de 6
      metros y pancromático de 1,5 metros de resolución espacial
      respectivamente .Las mismas son provistas por la Comisión Nacional de
      Actividades Espaciales (CONAE) http://www.conae.gov.ar 
      </li>
      <li>
        Cartografía generada en el marco de la Ley de Promoción Forestal,
        25.080 y su prórroga la Ley 26.432.
      </li>
      <li>
       Cartografía generada a partir de relevamientos a campo.
      </li>
      <li>
        Verificación sobre imágenes satelitales, Sentinel 2 A/B y servidores
        cartográficos.
      </li>
    </ul>
    <br><br>
    En el caso del área “Delta bonaerense y entrerriano” se ha incorporado también
    información proveniente de la clasificación y segmentación de imágenes Sentinel
    de acuerdo a la metodología descripta por Gaute et al., (2017) (1)
    <br><br>
    Los límites del país y la división político territorial del mismo tienen como
    autoridad de fuente al Instituto Geográfico Nacional de la República Argentina.
    Los mapas publicados están representados a escala provincial a excepción del
    “Delta entrerriano y bonaerense” representada por el área definida a tal efecto.
    <br><br>
    <dd>(1) Gaute M . ; Benítez R. ; Pietrantuono F. ; AchinelliF .; Alfonzo L. ;Ciccale
        Smit M. ; Clemente N ; Anthieni A .; De Titto .Caracterización de
        plantaciones de salicáceas en el Bajo Delta del Río Paraná a partir de
        información espectral multitemporal. Jornadas de Salicáceas 2017:
        Quinto Congreso Internacional de Salicáceas. Chile.
          <br>
         <a target="_blank "href="https://docs.google.com/viewer?a=v&pid=sites&srcid=ZGVmYXVsdGRvbWFpbnxhY3Rhc2pzMjAxN3xneDoxYzIwYWJiYjAyNDdjMTAw">Mas info</a>
        
        </dd>
  

 
  `;


  let dic = {
      'macizos' : pp
  };

  return dic[id];
}
  

export { content };





