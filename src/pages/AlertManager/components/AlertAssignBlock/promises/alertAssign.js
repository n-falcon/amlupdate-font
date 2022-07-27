import { alertAssignService } from '../services'

export default (alertId, userId, days, comments) => {
	return new Promise(resolve => {
		alertAssignService.save(alertId, userId, days, comments)
			.then(response => {
				resolve({ success: true, data: response.data })
			})
	})
}
