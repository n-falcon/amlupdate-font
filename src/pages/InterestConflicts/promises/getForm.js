import { FormService } from '../services'

export default (hash) => {
  return new Promise((resolve, reject) => {
    FormService.getForm(hash)
      .then(response => resolve(response))
      .catch(err => reject({ error: true }))
  })
}
