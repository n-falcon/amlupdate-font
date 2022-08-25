import { itemsService } from '../services'

export default (type, filters, items) => {
	return new Promise(resolve => {
		itemsService.deleteDeclarations(type, filters, items)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
