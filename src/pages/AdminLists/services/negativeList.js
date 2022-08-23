import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  read: (params) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/negativeList',
      method: 'post',
      body: params
    })
  },
  changeAllowNegClient: (allowNegAdm) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/changeAllowNegClient',
      method: 'post',
      body: {
        allowNegAdm
      }
    })
  }
}
