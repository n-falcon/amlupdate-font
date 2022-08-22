import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

const getRegionComunaService = {
  getRegionComunaService: (countryCode) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/public/getRegionesByCountry/'+countryCode,
      method: 'post',
    })
  },
}

export default getRegionComunaService;