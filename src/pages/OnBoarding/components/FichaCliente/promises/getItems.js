import { itemsService } from '../service'

export default (categoria, filters) => {
	return new Promise(resolve => {
		itemsService.itemsFicha(categoria, filters)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
