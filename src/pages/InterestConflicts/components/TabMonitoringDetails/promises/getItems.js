import { itemsService } from '../services'

export default (type, from, size, filters) => {
	return new Promise(resolve => {
		itemsService(type, from, size, filters)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
