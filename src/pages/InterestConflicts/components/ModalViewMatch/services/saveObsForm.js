import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (id, risk, observations) => {
	return apiRequestorHelper({
		url: apiConfig.url + '/cdi/saveObsRecipient',
		method: 'post',
    body: { id, risk, observations }
	})
}
