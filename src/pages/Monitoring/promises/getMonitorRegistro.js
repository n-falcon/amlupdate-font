import { transactionService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		transactionService.getMonitorRegistro(id)
			.then(response => resolve(response.data))
	})
}
