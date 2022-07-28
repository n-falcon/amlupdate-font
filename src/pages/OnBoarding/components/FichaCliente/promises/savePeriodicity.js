import { itemsService } from '../service'

export default (id, periodicity) => {
	return new Promise((resolve) => {
		itemsService.savePeriodicity(id, periodicity)
			.then(response => resolve(response.data))
	})
}
