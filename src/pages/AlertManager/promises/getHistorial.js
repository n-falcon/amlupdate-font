import { createTasksService } from '../services'

export default (alertId, userId) => {
	return new Promise(resolve => {
		createTasksService.getHistorial(alertId,userId)
			.then(response => resolve(response.data))
	})
}
