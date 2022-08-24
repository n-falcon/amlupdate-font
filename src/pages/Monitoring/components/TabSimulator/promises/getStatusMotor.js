import { getStatusMotorService } from '../services'

export default () => {
	return new Promise(resolve => {
		getStatusMotorService.get()
			.then(response => resolve({ success: true, data: response.data }))
	})
}
