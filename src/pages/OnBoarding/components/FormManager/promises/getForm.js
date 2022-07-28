import { itemsService } from '../service'

export default (id) => {
	return new Promise(resolve => {
		itemsService.getForm(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
