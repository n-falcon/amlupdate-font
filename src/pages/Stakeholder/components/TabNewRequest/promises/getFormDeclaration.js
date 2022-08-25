import { itemsService } from '../services'

export default (id, type) => {
	return new Promise(resolve => {
		itemsService.getCDIForm(id, type)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
