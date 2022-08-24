import { transactionService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		transactionService.getAlertasByRegistro(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
