import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  consultas: (mes) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/consultasResumen/' + mes,
      method: 'post'
    })
  },
  meses: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getMesesConsultas',
      method: 'post'
    })
  }
}
