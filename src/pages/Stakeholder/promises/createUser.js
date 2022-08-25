import { stakeholderService } from '../services'

export default (clientId, rut, response) => {
	return new Promise(resolve => {
		stakeholderService.createUser(clientId, rut, response)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
