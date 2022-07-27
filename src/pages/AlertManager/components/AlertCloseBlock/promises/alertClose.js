import { alertCloseService } from '../services'

export default (alertId, formData) => {
	return new Promise(resolve => {
		alertCloseService.save(alertId, formData)
			.then(response => {
				resolve({ success: true, data: response.data })
			})
	})
}