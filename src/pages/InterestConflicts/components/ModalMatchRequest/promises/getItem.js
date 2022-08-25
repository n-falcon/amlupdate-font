import { itemService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		itemService.read(id)
			.then(response => {
				resolve(response.data)
			})
	})
}
