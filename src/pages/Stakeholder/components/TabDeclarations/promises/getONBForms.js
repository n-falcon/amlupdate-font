import { itemsService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		itemsService.getONBForms(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
