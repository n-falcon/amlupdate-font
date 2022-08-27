import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

export default {
  getSIIActivities: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/public/getAllActecosSII',
      method: 'post',
    })
  },
}
