import { tareasService } from '../services'

export default (status,userId,filters) => {
	return new Promise(resolve => {
		tareasService.getTareas(status,userId,filters)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
