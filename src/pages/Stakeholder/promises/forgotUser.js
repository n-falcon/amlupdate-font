import { stakeholderService } from '../services'

export default (clientId, rut, response) => {
	return new Promise(resolve => {
		stakeholderService.forgotUser(clientId, rut, response)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
