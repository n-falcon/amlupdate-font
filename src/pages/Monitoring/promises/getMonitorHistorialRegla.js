import { transactionService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		transactionService.getMonitorHistorialRegla(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
