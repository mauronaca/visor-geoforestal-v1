function content(id){
  let pp = document.createElement('p');
  pp.id = "information-content-text"
  pp.innerHTML = `<a target="_blank "href="https://drive.google.com/file/d/1aj5QaI_PCSwitHA554isFLjzvAdXtMy1/view?usp=sharing">Macizos Forestales Metodología y &copy CITA</a>`;

  let dic = [
    {
      'id' : 'macizos',
      'p' : pp
    }
  ];

  let p;
  
  for(let i = 0 ; i < dic.length ; i ++){
    if(dic[i].id == id){
      p = dic[i].p
    }
  }

  return p;
}
  

export { content };