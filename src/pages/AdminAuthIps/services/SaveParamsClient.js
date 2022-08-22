import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  update: (userId, ips) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/saveParamsClient',
      method: 'post',
      body: {
        ofCto: userId,
        ips
      }
    })
  }
}
