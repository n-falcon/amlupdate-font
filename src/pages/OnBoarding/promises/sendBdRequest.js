import { onBoardingService } from '../services'

export default (bdParams) => {
	return new Promise(resolve => {
		onBoardingService.newSendRequest(bdParams)
			.then(response => resolve(response.data))
	})
}
