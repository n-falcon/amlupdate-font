import { transactionService } from '../services'

export default (filters) => {
	return new Promise(resolve => {
		transactionService.getRules(filters)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
