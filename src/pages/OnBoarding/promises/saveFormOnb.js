import { FormService } from '../services'

export default (form) => {
  return new Promise((resolve, reject) => {
    FormService.updateOnb(form)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
