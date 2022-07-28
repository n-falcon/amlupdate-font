import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
  upload: (fileData) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/onb/uploadNewRequest',
      method: 'post',
      body: fileData,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    })
  },
  newSendRequest: (bdParams) => {
    return apiRequestorHelper({
      url: apiConfig.url + '/onb/newSendRequest',
      method: 'post',
      body: bdParams
    })
  },
  declarations: (category, fromDate, toDate) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/declarations/D',
			method: 'post',
      body: {type:"KYC", category, fromDate, toDate, optDates: 'RANGE'}
		})
	}
}
