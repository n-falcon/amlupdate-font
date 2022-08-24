import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  getAlertas: (type, filters) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/transaction/getAlertas/' + type,
  		method: 'post',
  		body: filters
  	})
  },
  getRecordByRut: (rut) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/getClienteByRut/' + rut,
  		method: 'post'
  	})
  },
  createEvent: (obj) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/transaction/createEvent',
  		method: 'post',
      body: obj
  	})
  }
}
