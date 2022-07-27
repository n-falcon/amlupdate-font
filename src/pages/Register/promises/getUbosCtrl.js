import { itemsService } from '../services'

export default (rut, country) => {
	return new Promise(resolve => {
		itemsService.getUbosCtrlByRut(rut, country)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
