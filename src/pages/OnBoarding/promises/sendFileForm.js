import { FormService } from '../services'

export default (formData) => {
	return new Promise(resolve => {
		FormService.addFilesForm(formData)
			.then(response => resolve(response.data))
	})
}
