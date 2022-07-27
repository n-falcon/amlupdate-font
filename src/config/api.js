const api = {}


if ( process.env.REACT_APP_ENV === 'prod') {
  api.url = 'https://api.amlupdate.com/api'
  api.urlAml = 'https://www.amlupdate.com/mvc'
}else if(process.env.REACT_APP_ENV === 'qa') {
  api.url = 'https://apiqa.amlupdate.com/api'
  api.urlAml = 'https://qa.amlupdate.com/mvc'
}else {
  api.url = 'http://localhost:5000/api'
  api.urlAml = 'https://qa.amlupdate.com/mvc'
  //api.url = 'https://apiqa.amlupdate.com/api'
}

export default api
