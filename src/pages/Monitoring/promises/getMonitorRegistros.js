import { transactionService } from '../services'

export default (category,filters) => {
	return new Promise(resolve => {
		transactionService.getMonitorRegistros(category,filters)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
