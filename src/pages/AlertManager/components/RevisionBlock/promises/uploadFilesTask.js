import { uploadFilesTaskService } from '../services'

export default (formData, userId, origin, alertId, taskNro) => {
	return new Promise((resolve, reject) => {
		uploadFilesTaskService.upload(formData, userId, origin, alertId, taskNro)
			.then(response => {
				resolve({ success: true, data: response.data })
			})
      .catch(err => {
        reject({ error: true, message: err })
      })
	})
}
