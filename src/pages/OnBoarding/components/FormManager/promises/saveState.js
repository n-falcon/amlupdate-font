import { itemsService } from '../service'

export default (id, statusDecl, statusComments, resendOnBoardingForm) => {
	return new Promise((resolve) => {
		itemsService.saveState(id, statusDecl, statusComments, resendOnBoardingForm)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
