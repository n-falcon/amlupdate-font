import { getVinculosService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		getVinculosService(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
