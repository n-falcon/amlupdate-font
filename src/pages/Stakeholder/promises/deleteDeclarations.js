import { stakeholderService } from '../services'

export default (userId, items) => {
	return new Promise(resolve => {
		stakeholderService.deleteDeclarations(userId, items)
			.then(response => resolve({ success: true, data: response.data }))
			.catch(error => resolve({ success: false, error }))
	})
}
