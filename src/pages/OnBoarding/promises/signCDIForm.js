import { FormService } from '../services'

export default (id, email) => {
	return new Promise((resolve, reject) => {
		FormService.signCDIForm(id, email)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  	})
}
