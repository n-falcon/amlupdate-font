import { onBoardingService } from '../services'

export default (category, fromDate, toDate) => {
	return new Promise(resolve => {
		onBoardingService.declarations(category, fromDate, toDate)
			.then(response => {
				resolve({ success: true, data: response.data })
			})
	})
}
