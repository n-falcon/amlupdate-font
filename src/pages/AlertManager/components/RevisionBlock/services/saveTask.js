import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	save: (task) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/portal/saveTask',
			method: 'post',
			body: task
		})
	}
}
