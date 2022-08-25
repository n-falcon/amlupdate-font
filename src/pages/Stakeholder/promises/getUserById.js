import { stakeholderService } from '../services'

export default (clientId, id) => {
	return new Promise(resolve => {
		stakeholderService.getUserById(clientId, id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
