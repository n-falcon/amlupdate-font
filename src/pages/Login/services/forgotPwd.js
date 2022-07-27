import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  create: (username) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/forgotPwd',
      method: 'post',
      body: {
        username
      }
    })
  }
}
