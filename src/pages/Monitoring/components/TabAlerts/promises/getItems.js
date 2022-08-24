import { itemsService } from '../services'

export default (type, filters) => {
	return new Promise(resolve => {
		itemsService.getAlertas(type, filters)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
