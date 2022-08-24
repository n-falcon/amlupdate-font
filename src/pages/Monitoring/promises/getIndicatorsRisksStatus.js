import { transactionService } from '../services'

export default (body) => {
	return new Promise(resolve => {
		transactionService.getIndicatorsRisksStatus(body)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
