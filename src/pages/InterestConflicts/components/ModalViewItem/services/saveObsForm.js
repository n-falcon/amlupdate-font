import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (id, authorized, risk, observations) => {
	return apiRequestorHelper({
		url: apiConfig.url + '/cdi/saveObsForm',
		method: 'post',
    body: { id, authorized, risk, observations }
	})
}
