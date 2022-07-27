import { itemsService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		itemsService.getFicha(id)
			.then(response => resolve(response.data))
	})
}
