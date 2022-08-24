import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  get: () => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/transaction/getStatusMotor',
  		method: 'post'
  	})
  }
}
