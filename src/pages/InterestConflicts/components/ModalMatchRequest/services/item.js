import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	save: (body) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/saveMatchRequest',
			method: 'post',
			body
		})
	},
	read: (id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/declaration/' + id,
			method: 'post'
		})
	}
}
