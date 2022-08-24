import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  simulate: (id) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/transaction/simulateRules/' + id,
  		method: 'post',
  		body: {
        id
      }
  	})
  }
}
