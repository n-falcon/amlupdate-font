import apiConfig from '../../../../../../../config'
import { apiRequestorHelper } from '../../../../../../../helpers'

export default (id) => {
	return apiRequestorHelper({
		url: apiConfig.url + '/cdi/getCDIRegistroDetail/' + id,
		method: 'post'
	})
}
