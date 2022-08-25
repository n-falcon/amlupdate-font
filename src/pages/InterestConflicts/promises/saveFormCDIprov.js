import { FormService } from '../services'

export default (form) => {
  return new Promise((resolve, reject) => {
    FormService.updateCDIprov(form)
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
