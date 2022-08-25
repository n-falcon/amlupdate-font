import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default (formId, title, comments) => {
	return apiRequestorHelper({
		url: apiConfig.url + '/cdi/saveComments',
		method: 'post',
    body: { formId, title, comments }
	})
}
