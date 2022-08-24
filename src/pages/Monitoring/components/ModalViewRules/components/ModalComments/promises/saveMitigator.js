import { saveMitigatorService } from '../services'

export default (body) => {
	return new Promise(resolve => {
		saveMitigatorService(body)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
