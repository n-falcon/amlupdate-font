import apiConfig from '../../../../../config/api'
import { apiRequestorHelper } from '../../../../../helpers'

export default {
	read: (id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/portal/getAlerta/' + id,
			method: 'post'
		})
	}
}
