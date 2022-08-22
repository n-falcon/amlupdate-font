import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

const getSiiActivities = {
  getSIIActivities: () => {
    return apiRequestorHelper({
      url: apiConfig.url + '/public/getAllActecosSII',
      method: 'post',
    })
  },
}
export default getSiiActivities
