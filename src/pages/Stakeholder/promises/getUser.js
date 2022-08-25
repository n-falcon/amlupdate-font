import { stakeholderService } from '../services'

export default (clientId, rut, password) => {
	return new Promise(resolve => {
		stakeholderService.getUser(clientId, rut, password)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
