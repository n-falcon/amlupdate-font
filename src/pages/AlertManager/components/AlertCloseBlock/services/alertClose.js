import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	save: (alertId, formData) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/actionAlert/' + alertId,
			method: 'post',
			body: formData
		})
	}
}
