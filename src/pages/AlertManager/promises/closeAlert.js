import { itemService } from '../services'

export default (alertId) => {
	return new Promise(resolve => {
		itemService.closeAlert(alertId)
			.then(response => resolve(response.data))
	})
}
