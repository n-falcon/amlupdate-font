import { getSimulacionService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		getSimulacionService.get(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
