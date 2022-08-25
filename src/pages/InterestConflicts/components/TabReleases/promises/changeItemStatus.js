import { changeItemStatusService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		changeItemStatusService(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
