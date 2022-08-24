import { transactionService } from '../services'

export default () => {
	return new Promise(resolve => {
		transactionService.getCategoriesClient()
			.then(response => resolve(response.data))
	})
}
