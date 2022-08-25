import { saveObsFormService } from '../services'

export default (id, authorized, risk, observations) => {
	return new Promise(resolve => {
		saveObsFormService(id, authorized, risk, observations)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
