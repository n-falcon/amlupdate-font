import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	read: (from, size, categories, text, company, area) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/getClientesMin',
			method: 'post',
			body: { from, size, categories, text, company, area }
		})
	}
}
