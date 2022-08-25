import { FormService } from '../services'

export default (clientId) => {
  return new Promise((resolve, reject) => {
    FormService.getParamsClient(clientId)
      .then(response => resolve(response))
      .catch(err => reject({ error: true }))
  })
}
