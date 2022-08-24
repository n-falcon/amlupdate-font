import { itemsService } from '../services'

export default (obj) => {
	return new Promise(resolve => {
		itemsService.createEvent(obj)
			.then(response => resolve(response.data))
	})
}
