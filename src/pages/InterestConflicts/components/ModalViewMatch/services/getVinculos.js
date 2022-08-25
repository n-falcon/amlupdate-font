import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (id) => {
	return apiRequestorHelper({
		url: apiConfig.url + '/cdi/getCDIRelacionadosCDI/' + id,
		method: 'post'
	})
}
