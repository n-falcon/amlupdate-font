import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  delete: (id) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/deleteFile',
      method: 'post',
      body: {
        id
      }
    })
  }
}
