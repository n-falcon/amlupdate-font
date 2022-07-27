import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	save: (alertId, userId, days, comments) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/assignAlert',
			method: 'post',
			body: {
        id: alertId,
        assign: {
          userId,
          days,
          comments
        }
      }
		})
	}
}
