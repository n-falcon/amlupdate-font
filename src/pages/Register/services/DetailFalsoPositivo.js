import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  read: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getDetailFalsoPositivo',
      method: 'post',
      body: {
        id
      }
    })
  },
  getProfiles: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getDJObjectsFalsePositive',
      method: 'post',
      body: {
        id
      }
    })
  }
}
