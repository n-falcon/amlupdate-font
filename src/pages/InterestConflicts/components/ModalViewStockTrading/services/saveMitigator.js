import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (body) => {
	return apiRequestorHelper({
		url: apiConfig.url + '/cdi/saveMitigadorRegistro',
		method: 'post',
    body,
	})
}
