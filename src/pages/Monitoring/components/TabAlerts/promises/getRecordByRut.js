import { itemsService } from '../services'

export default (rut) => {
	return new Promise(resolve => {
		itemsService.getRecordByRut(rut)
			.then(response => resolve(response.data))
	})
}
