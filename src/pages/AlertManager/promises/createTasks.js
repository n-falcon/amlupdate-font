import { createTasksService } from '../services'

export default (id, tasks) => {
	return new Promise(resolve => {
		createTasksService.create(id, tasks)
			.then(response => resolve(response.data))
	})
}
