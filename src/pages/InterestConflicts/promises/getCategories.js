import { getCategoriesService } from '../services'

export default (id) => {
	return new Promise(resolve => {
		getCategoriesService()
			.then(response => resolve({ success: true, data: response.data }))
	})
}
