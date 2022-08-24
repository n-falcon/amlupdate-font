import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  get: (id) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/transaction/getSimulacion/' + id,
  		method: 'post'
  	})
  }
}
