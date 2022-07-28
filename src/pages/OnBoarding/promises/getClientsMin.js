import { getClientsMinService } from '../services'

export default (from, size, categories, text, company, area, type, grupos) => {
	return new Promise(resolve => {
		getClientsMinService.read(from, size, categories, text, company, area, type, grupos)
			.then(response => {
				resolve({ success: true, data: response.data })
			})
	})
}
