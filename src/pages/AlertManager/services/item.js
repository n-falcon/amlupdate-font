import apiConfig from '../../../config/api'
import { apiRequestorHelper } from '../../../helpers'

export default {
	read: (id) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getAlerta/' + id,
			method: 'post'
		})
	},
	closeAlert: (alertId) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/closeAlert/'+alertId,
			method: 'post',
		})
	},
	getFalsosPositivos: (alertId) => {
		return apiRequestorHelper({
			url: apiConfig.url + '/transaction/getDetailFalsoPositivo',
			method: 'post',
			body: {
				id: alertId
			}
		})
	}
}
