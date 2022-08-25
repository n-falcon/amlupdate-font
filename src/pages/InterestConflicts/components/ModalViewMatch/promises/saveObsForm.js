import { saveObsFormService } from '../services'

export default (id, risk, observations) => {
	return new Promise(resolve => {
		saveObsFormService(id, risk, observations)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
