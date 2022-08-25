import { portalService } from '../services'

export default (userId) => {
	return new Promise(resolve => {
		portalService
      .getEstadoTareasUser(userId)
      .then((response) => resolve({ success: true, data: response.data }));
	})
}
