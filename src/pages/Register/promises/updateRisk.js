import { itemsService } from '../services'

export default (id, risk, commentRisk) => {
	return new Promise(resolve => {
		itemsService.updateRisk(id, risk, commentRisk)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
