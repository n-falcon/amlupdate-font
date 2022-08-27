import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

export default {
  getRegionComunaService: (countryCode) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/public/getRegionesByCountry/'+countryCode,
      method: 'post',
    })
  },
}
