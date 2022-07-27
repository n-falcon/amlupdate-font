import { saveTaskService } from '../services'

export default (task) => {
	return new Promise((resolve, reject) => {
		saveTaskService.save(task)
			.then(response => {
				resolve({ success: true, data: response.data })
			})
      .catch(err => {
        reject({ error: true, message: err })
      })
	})
}
