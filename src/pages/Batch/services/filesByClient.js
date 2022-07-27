import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  read: (from, size, fromDate, toDate, userId, fileName, optDates) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/filesByClient',
      method: 'post',
      body: {
        from,
        size,
        fromDate,
        toDate,
        userId,
        fileName,
        optDates
      }
    })
  }
}
