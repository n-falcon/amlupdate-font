import { itemService } from '../services'

export default (alertId) => {
	return new Promise(resolve => {
		itemService.getFalsosPositivos(alertId)
			.then(response => resolve(response.data))
	})
}
