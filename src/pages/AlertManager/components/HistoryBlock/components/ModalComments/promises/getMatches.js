import { getMatchesService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		getMatchesService(id)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
