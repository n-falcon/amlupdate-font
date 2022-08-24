import apiConfig from '../../../../../../config/api'
import { apiRequestorHelper } from '../../../../../../helpers'

export default {
  get: (from, size) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/transaction/getSimulaciones',
  		method: 'post',
      body: {
        from,
        size
      }
  	})
  }
}
