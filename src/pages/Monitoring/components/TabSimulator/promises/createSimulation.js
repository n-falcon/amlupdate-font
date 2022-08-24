import { getItemsService } from '../services'

export default (name, period, simId = null) => {
	return new Promise(resolve => {
		getItemsService.get(name, period, simId)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
