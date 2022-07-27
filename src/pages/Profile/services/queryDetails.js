import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  read: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/getSearchDetail',
      method: 'post',
      body: {
        id
      }
    })
  }
}
