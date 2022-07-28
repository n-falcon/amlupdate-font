import { onBoardingService } from '../services'

export default (fileData) => {
	return new Promise(resolve => {
		onBoardingService.upload(fileData)
			.then(response => resolve(response.data))
	})
}
