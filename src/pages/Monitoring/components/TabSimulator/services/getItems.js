import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  get: (name, period, simId = null) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/transaction/createSimulacion',
  		method: 'post',
  		body: {
        name,
        period,
        id: simId !== null ? simId : undefined
      }
  	})
  }
}
