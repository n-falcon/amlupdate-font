import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	upload: (formData, userId, origin, alertId, taskNro) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/portal/uploadFileTask/'+userId+'/'+origin+'/'+alertId+'/'+taskNro,
			method: 'post',
			body: formData
		})
	}
}
