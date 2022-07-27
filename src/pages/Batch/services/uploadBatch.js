import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  create: (formData) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/uploadBatch',
      method: 'post',
      body: formData
    })
  }
}
