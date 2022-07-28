import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default () => {
	return apiRequestorHelper({
		url: apiConfig.url + '/cdi/getCategoriesClient',
		method: 'post'
	})
}
