import { getClientsMinService } from '../services'

export default (from, size, categories, text, company, area) => {
	return new Promise(resolve => {
		getClientsMinService.areas()
			.then(response => {
				resolve(response.data)
			})
	})
}
