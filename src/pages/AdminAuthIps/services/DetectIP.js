import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  read: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/detectIP',
      method: 'post'
    })
  }
}
