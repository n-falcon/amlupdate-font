import { FormService } from '../services'

export default (id, requestId) => {
  return new Promise((resolve, reject) => {
    FormService.send(id, requestId)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
