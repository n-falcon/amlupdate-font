import { changeMatchStatusService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		changeMatchStatusService(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
