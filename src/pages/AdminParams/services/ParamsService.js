import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  read: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getParametrosCliente',
      method: 'post'
    })
  },

  save: (params) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/saveParametrosCliente',
      method: 'post',
      body: params
    })
  },

  getCountries: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getCountryFilter',
      method: 'post'
    })
  },
  getNewsLetter: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getNewsLetter',
      method: 'post'
    })
  },
  getNewsGesintel: (currentUser) => {
    let idCategory = 9
    if(currentUser.cliente.pais === 'PER') {
      idCategory = 10
    }
    return apiRequestorHelper({
      url: 'https://www.gesintel.cl/wp-json/wp/v2/posts?_embed&categories='+idCategory+'&per_page=10',
      method: 'get'
    }, false)
  }
}
