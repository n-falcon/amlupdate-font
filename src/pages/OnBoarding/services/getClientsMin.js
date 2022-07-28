import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
	read: (from, size, categories, text, company, area, type, grupos) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/getClientesMin',
			method: 'post',
			body: { from, size, categories, text, company, area, type, estados: ['ACTIVE'], grupos }
		})
	},
	areas: () => {
		return apiRequestorHelper({
			url: apiConfig.url + '/getAreasClient',
			method: 'post'
		})
	}
}
