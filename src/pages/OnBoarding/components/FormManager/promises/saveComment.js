import { itemsService } from '../service'

export default (formId, title, comments) => {
	return new Promise((resolve) => {
		itemsService.saveComments(formId, title, comments)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
