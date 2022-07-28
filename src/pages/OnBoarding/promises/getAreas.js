import { getClientsMinService } from '../services'

export default () => {
	return new Promise(resolve => {
		getClientsMinService.areas()
			.then(response => {
				resolve(response.data)
			})
	})
}