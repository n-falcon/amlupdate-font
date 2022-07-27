import { getClientsMinService } from '../services'

export default (from, size, categories, text, company, area) => {
	return new Promise(resolve => {
		getClientsMinService.read(from, size, categories, text, company, area)
			.then(response => {
				resolve({ success: true, data: response.data })
			})
	})
}
