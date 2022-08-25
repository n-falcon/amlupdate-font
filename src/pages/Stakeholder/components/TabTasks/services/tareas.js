import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
  getTareas: (status, userId , filters) => {
    return apiRequestorHelper({
  		url: apiConfig.url + '/transaction/portal/getTareasUser/' + userId + '/' + status,
      method: 'post',
      body: filters
  	})
  }
}
