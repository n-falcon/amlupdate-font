import { getFormFileService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		getFormFileService(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
