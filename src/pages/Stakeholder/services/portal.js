import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
	validateCaptchaResponse: (response) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/verifyGoogleCaptcha',
			method: 'post',
			body: {response}
		})
	},
	getCaptchaPublicKey: () => {
		return apiRequestorHelper({
			url: apiConfig.url + '/portal/getCaptchaPublicKey',
			method: 'post'
		})
	  },
	getEstadoTareasUser: (userId) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/portal/getEstadoTareasUser/' + userId,
			method: 'post'
		})
	},
	getUsersRespTareas: (userId) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/portal/getUsersRespTareas/' + userId,
			method: 'post'
		})
	},
	
}