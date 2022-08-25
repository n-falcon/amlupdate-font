import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	save: (type, body) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/cdi/saveDeclaration/' + type,
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
