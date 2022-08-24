import { transactionService } from '../services'

export default () => {
	return new Promise(resolve => {
		transactionService.getMonitorTipoReglas()
			.then(response => resolve({ success: true, data: response.data }))
	})
}
