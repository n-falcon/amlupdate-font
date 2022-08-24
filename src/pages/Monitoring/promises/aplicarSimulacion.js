import { transactionService } from '../services'

export default (simId,status) => {
	return new Promise(resolve => {
		transactionService.aplicarSimulacion(simId,status)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
