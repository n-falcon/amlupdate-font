import { createTasksService } from '../services'

export default (alertId, comments) => {
	return new Promise(resolve => {
		createTasksService.requestRos(alertId,comments)
			.then(response => resolve(response.data))
	})
}
