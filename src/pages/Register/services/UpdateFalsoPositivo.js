import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  update: (recordId, uboId, id, falsesId, alertId, comments) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/updateFalsoPositivo',
      method: 'post',
      body: {
        recordId,
        uboId,
        id,
        falsesId,
        alertId,
        comments
      }
    })
  }
}
