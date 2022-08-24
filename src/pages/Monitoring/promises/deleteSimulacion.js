import { transactionService } from '../services'

export default (simId) => {
	return new Promise(resolve => {
		transactionService.deleteSimulacion(simId)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
