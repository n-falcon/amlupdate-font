import getSimulacionesService from './getSimulacionesServ'

export default (from, size) => {
	return new Promise(resolve => {
		getSimulacionesService.get(from, size)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
